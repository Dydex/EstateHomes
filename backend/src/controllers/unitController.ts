import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function createUnit(req: Request, res: Response): Promise<void> {
    try {
        const { propertyId } = req.params;
        const { unit_number, bedrooms, bathrooms, yearly_rent } = req.body;

        if (!unit_number) {
            res.status(400).json({ message: "unit_number is required" });
            return;
        }

        const result = await pool.query(
            `INSERT INTO units (property_id, unit_number, bedrooms, bathrooms, yearly_rent)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [propertyId, unit_number, bedrooms || 0, bathrooms || 0, yearly_rent]
        );

        res.status(201).json({
            message: "Unit created successfully",
            unit: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating unit:", error);
        res.status(500).json({ message: "Failed to create unit" });
    }
}

export async function getAllUnits(req: Request, res: Response): Promise<void> {
    try {
        const { propertyId } = req.params;

        const result = await pool.query(
            "SELECT * FROM units WHERE property_id = $1 ORDER BY created_at DESC",
            [propertyId]
        );

        res.status(200).json({
            message: "Units retrieved successfully",
            units: result.rows
        });
    } catch (error) {
        console.error("Error getting units:", error);
        res.status(500).json({ message: "Failed to retrieve units" });
    }
}

export async function getUnit(req: Request, res: Response): Promise<void> {
    try {
        const { unitId } = req.params;

        const result = await pool.query(
            "SELECT * FROM units WHERE id = $1",
            [unitId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Unit not found" });
            return;
        }

        res.status(200).json({
            unit: result.rows[0]
        });
    } catch (error) {
        console.error("Error getting unit:", error);
        res.status(500).json({ message: "Failed to retrieve unit" });
    }
}

export async function updateUnit(req: Request, res: Response): Promise<void> {
    try {
        const { unitId } = req.params;
        const { unit_number, bedrooms, bathrooms, yearly_rent, status } = req.body;

        if (unit_number === undefined && bedrooms === undefined && bathrooms === undefined &&
            yearly_rent === undefined && status === undefined) {
            res.status(400).json({ message: "At least one field is required to update" });
            return;
        }

        const result = await pool.query(
            `UPDATE units
             SET unit_number = COALESCE($1, unit_number),
                 bedrooms = COALESCE($2, bedrooms),
                 bathrooms = COALESCE($3, bathrooms),
                 yearly_rent = COALESCE($4, yearly_rent),
                 status = COALESCE($5, status)
             WHERE id = $6
             RETURNING *`,
            [unit_number, bedrooms, bathrooms, yearly_rent, status, unitId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Unit not found" });
            return;
        }

        res.status(200).json({
            message: "Unit updated successfully",
            unit: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating unit:", error);
        res.status(500).json({ message: "Failed to update unit" });
    }
}

export async function deleteUnit(req: Request, res: Response): Promise<void> {
    try {
        const { unitId } = req.params;

        const result = await pool.query(
            "DELETE FROM units WHERE id = $1 RETURNING *",
            [unitId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Unit not found" });
            return;
        }

        res.status(200).json({
            message: "Unit deleted successfully",
            unit: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting unit:", error);
        res.status(500).json({ message: "Failed to delete unit" });
    }
}
