import { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function getAllProperties(req: Request, res: Response): Promise<void> {
    try{
        const result = await pool.query(
            "SELECT * FROM properties ORDER BY created_at DESC"
        ); 

        res.status(200).json ({
            message: "Properties retrieved successfully",
            properties:result.rows
        });
    } catch (error) {
        console.error("Error getting properties:", error);
        res.status(500).json({message:" Failed to retrieve properties"});
    }
}

export async function updateProperty(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const {
            title,
            location,
            price,
            description
        } = req.body;

        if (title === undefined && location === undefined && price === undefined && description === undefined ) {
            res.status(400).json({
                message: "At least one property field is required"
            });
            return;
        }

        const result = await pool.query(
            `UPDATE properties
             SET title = COALESCE($1, title),
                 location = COALESCE($2, location),
                 price = COALESCE($3, price),
                 description = COALESCE($4, description)
             WHERE id = $5
             RETURNING *`,
            [title, location, price, description, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Property not found"
            });
            return;
        }

        res.status(200).json({
            message: "Property updated successfully",
            property: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating property:", error);

        res.status(500).json({
            message: "Failed to update property"
        });
    }
}

export async function createProperty(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            });
        }

        const {
            title,
            location,
            price,
            description
        } = req.body;

        if (!title || !location || !price) {
            res.status(400).json({
                message: "Title, location and price are required"
            });
            return;
        }

        const result = await pool.query(
            `INSERT INTO properties 
            (title, location, price, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [title, location, price, description]
        );

        res.status(201).json({
            message: "Property created successfully",
            property: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating property:", error);

        res.status(500).json({
            message: "Failed to create property"
        });
    }
}

export async function deleteProperty(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM properties WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Property not found"
            });
            return;
        }

        res.status(200).json({
            message: "Property deleted successfully",
            property: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting property:", error);

        res.status(500).json({
            message: "Failed to delete property"
        });
    }
}

export async function getProperty(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM properties WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Property not found"
            });
            return;
        }

        res.status(200).json({
            property: result.rows[0]
        });

    } catch (error) {
        console.error("Error getting property:", error);

        res.status(500).json({
            message: "Failed to retrieve property"
        });
    }
}
