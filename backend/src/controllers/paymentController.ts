import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function getPaymentsByLease(req: Request, res: Response): Promise<void> {
    try {
        const { leaseId } = req.params;

        const result = await pool.query(
            "SELECT * FROM payments WHERE lease_id = $1 ORDER BY installment_number",
            [leaseId]
        );

        res.status(200).json({
            message: "Payments retrieved successfully",
            payments: result.rows
        });
    } catch (error) {
        console.error("Error getting payments:", error);
        res.status(500).json({ message: "Failed to retrieve payments" });
    }
}

export async function recordPayment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE payments
             SET status = 'paid', paid_at = NOW()
             WHERE id = $1 AND status = 'pending'
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Pending payment not found" });
            return;
        }

        res.status(200).json({
            message: "Payment recorded successfully",
            payment: result.rows[0]
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        res.status(500).json({ message: "Failed to record payment" });
    }
}

export async function getOverduePayments(req: Request, res: Response): Promise<void> {
    try {
        const result = await pool.query(
            `SELECT p.*, l.tenant_id, u.name AS tenant_name, u.email AS tenant_email,
                    un.unit_number, un.property_id
             FROM payments p
             JOIN leases l ON p.lease_id = l.id
             JOIN users u ON l.tenant_id = u.id
             JOIN units un ON l.unit_id = un.id
             WHERE p.due_date < NOW() AND p.status = 'pending'
             ORDER BY p.due_date ASC`
        );

        res.status(200).json({
            message: "Overdue payments retrieved successfully",
            payments: result.rows
        });
    } catch (error) {
        console.error("Error getting overdue payments:", error);
        res.status(500).json({ message: "Failed to retrieve overdue payments" });
    }
}
