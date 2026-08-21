import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        res.status(400).json({message: 'Please provide all required fields'});
        return;
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
        res.status(409).json({message: "User already exists "});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password) 
        VALUES($1, $2, $3) 
        RETURNING id, name, email, role`, 
        [name, email, hashedPassword]);

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
} 

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({message: "Email and password required"});
            return;
        }

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(result.rows.length === 0){
            res.status(401).json({message: "Invalid email or password"});
            return;
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({
                message: "Invalid email or password"
            });
            return;
        }

        const token = jwt.sign(
            {
            id: user.id,
            email: user.email,
            role: user.role
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        )

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

export async function logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie("token");

    res.json({
        message: "Logout successful"
    });
}

export async function forgotPassword(_req: Request, _res: Response): Promise<void> {
    
}

export async function resetPassword(_req: Request, _res: Response): Promise<void> {
    
}
