import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function createLease(req: Request, res: Response): Promise<void> {
    try {
        const { tenant_id, unit_id, start_date, end_date, installments } = req.body;

        if (!tenant_id || !unit_id || !start_date || !end_date) {
            res.status(400).json({
                message: "tenant_id, unit_id, start_date, and end_date are required"
            });
            return;
        }

        const installmentCount = installments || 1;
        if (installmentCount < 1 || installmentCount > 3) {
            res.status(400).json({ message: "Installments must be 1, 2, or 3" });
            return;
        }

        // Verify tenant exists and has role 'tenant'
        const tenantCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND role = 'tenant'",
            [tenant_id]
        );
        if (tenantCheck.rows.length === 0) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }

        // Get yearly_rent from the unit
        const unitResult = await pool.query(
            "SELECT id, yearly_rent, status FROM units WHERE id = $1",
            [unit_id]
        );
        if (unitResult.rows.length === 0) {
            res.status(404).json({ message: "Unit not found" });
            return;
        }

        const unit = unitResult.rows[0];
        if (!unit.yearly_rent) {
            res.status(400).json({ message: "Unit does not have a yearly rent set" });
            return;
        }

        const yearlyRent = parseFloat(unit.yearly_rent);

        // Create the lease
        const leaseResult = await pool.query(
            `INSERT INTO leases (tenant_id, unit_id, start_date, end_date, yearly_rent, installments)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [tenant_id, unit_id, start_date, end_date, yearlyRent, installmentCount]
        );

        const lease = leaseResult.rows[0];

        // Auto-generate payment records
        const installmentAmount = Math.round((yearlyRent / installmentCount) * 100) / 100;
        const startDateObj = new Date(start_date);
        const endDateObj = new Date(end_date);
        const totalDays = (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24);
        const intervalDays = Math.floor(totalDays / installmentCount);

        const payments = [];
        for (let i = 0; i < installmentCount; i++) {
            const dueDate = new Date(startDateObj);
            dueDate.setDate(dueDate.getDate() + (intervalDays * i));

            const paymentResult = await pool.query(
                `INSERT INTO payments (lease_id, installment_number, amount, due_date)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [lease.id, i + 1, installmentAmount, dueDate.toISOString().split('T')[0]]
            );

            payments.push(paymentResult.rows[0]);
        }

        // Mark unit as occupied
        await pool.query("UPDATE units SET status = 'occupied' WHERE id = $1", [unit_id]);

        res.status(201).json({
            message: "Lease created successfully",
            lease,
            payments
        });
    } catch (error) {
        console.error("Error creating lease:", error);
        res.status(500).json({ message: "Failed to create lease" });
    }
}

export async function getLease(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const leaseResult = await pool.query(
            `SELECT l.*, u.name AS tenant_name, u.email AS tenant_email,
                    un.unit_number, un.property_id
             FROM leases l
             JOIN users u ON l.tenant_id = u.id
             JOIN units un ON l.unit_id = un.id
             WHERE l.id = $1`,
            [id]
        );

        if (leaseResult.rows.length === 0) {
            res.status(404).json({ message: "Lease not found" });
            return;
        }

        const paymentsResult = await pool.query(
            "SELECT * FROM payments WHERE lease_id = $1 ORDER BY installment_number",
            [id]
        );

        res.status(200).json({
            lease: leaseResult.rows[0],
            payments: paymentsResult.rows
        });
    } catch (error) {
        console.error("Error getting lease:", error);
        res.status(500).json({ message: "Failed to retrieve lease" });
    }
}

export async function getAllLeases(req: Request, res: Response): Promise<void> {
    try {
        const { tenant_id, unit_id } = req.query;

        let query = `
            SELECT l.*, u.name AS tenant_name, u.email AS tenant_email,
                   un.unit_number, un.property_id
            FROM leases l
            JOIN users u ON l.tenant_id = u.id
            JOIN units un ON l.unit_id = un.id
        `;
        const params: (string | string[])[] = [];
        const conditions: string[] = [];

        if (tenant_id) {
            conditions.push(`l.tenant_id = $${params.length + 1}`);
            params.push(tenant_id as string);
        }
        if (unit_id) {
            conditions.push(`l.unit_id = $${params.length + 1}`);
            params.push(unit_id as string);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ' ORDER BY l.created_at DESC';

        const result = await pool.query(query, params);

        res.status(200).json({
            message: "Leases retrieved successfully",
            leases: result.rows
        });
    } catch (error) {
        console.error("Error getting leases:", error);
        res.status(500).json({ message: "Failed to retrieve leases" });
    }
}

export async function terminateLease(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE leases SET status = 'terminated' WHERE id = $1 AND status = 'active' RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Active lease not found" });
            return;
        }

        // Mark unit as vacant again
        await pool.query(
            "UPDATE units SET status = 'vacant' WHERE id = $1",
            [result.rows[0].unit_id]
        );

        res.status(200).json({
            message: "Lease terminated successfully",
            lease: result.rows[0]
        });
    } catch (error) {
        console.error("Error terminating lease:", error);
        res.status(500).json({ message: "Failed to terminate lease" });
    }
}
