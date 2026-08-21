import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function inviteTenant(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email) {
            res.status(400).json({ message: "Name and email are required" });
            return;
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({ message: "A user with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password || 'changeme123', 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, phone, password, role)
             VALUES ($1, $2, $3, $4, 'tenant')
             RETURNING id, name, email, phone, role, created_at`,
            [name, email, phone, hashedPassword]
        );

        res.status(201).json({
            message: "Tenant invited successfully",
            tenant: result.rows[0]
        });
    } catch (error) {
        console.error("Error inviting tenant:", error);
        res.status(500).json({ message: "Failed to invite tenant" });
    }
}

export async function getTenant(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1 AND role = 'tenant'",
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }

        res.status(200).json({
            tenant: result.rows[0]
        });
    } catch (error) {
        console.error("Error getting tenant:", error);
        res.status(500).json({ message: "Failed to retrieve tenant" });
    }
}

export async function getAllTenants(req: Request, res: Response): Promise<void> {
    try {
        const result = await pool.query(
            "SELECT id, name, email, phone, role, created_at FROM users WHERE role = 'tenant' ORDER BY created_at DESC"
        );

        res.status(200).json({
            message: "Tenants retrieved successfully",
            tenants: result.rows
        });
    } catch (error) {
        console.error("Error getting tenants:", error);
        res.status(500).json({ message: "Failed to retrieve tenants" });
    }
}

export async function updateTenant(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        if (name === undefined && email === undefined && phone === undefined) {
            res.status(400).json({ message: "At least one field is required to update" });
            return;
        }

        const result = await pool.query(
            `UPDATE users
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 phone = COALESCE($3, phone)
             WHERE id = $4 AND role = 'tenant'
             RETURNING id, name, email, phone, role, created_at`,
            [name, email, phone, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }

        res.status(200).json({
            message: "Tenant updated successfully",
            tenant: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating tenant:", error);
        res.status(500).json({ message: "Failed to update tenant" });
    }
}

export async function deleteTenant(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 AND role = 'tenant' RETURNING id, name, email, phone, role",
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }

        res.status(200).json({
            message: "Tenant deleted successfully",
            tenant: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting tenant:", error);
        res.status(500).json({ message: "Failed to delete tenant" });
    }
}
