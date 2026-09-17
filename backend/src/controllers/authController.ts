import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendMail } from '../utils/mailer.js';


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

const RESET_CODE_TTL_MINUTES = 15;
const RESET_CODE_MAX_ATTEMPTS = 5;

export async function forgotPassword(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        // Same response whether or not the account exists, so emails can't be enumerated
        const genericResponse = {
            message: "If an account with that email exists, a reset code has been sent"
        };

        const userResult = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);

        if (userResult.rows.length === 0) {
            res.json(genericResponse);
            return;
        }

        const user = userResult.rows[0];
        const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
        const codeHash = await bcrypt.hash(code, 10);

        // Only the newest code should work
        await pool.query(
            "UPDATE password_resets SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL",
            [user.id]
        );

        await pool.query(
            `INSERT INTO password_resets (user_id, code_hash, expires_at)
             VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
            [user.id, codeHash, RESET_CODE_TTL_MINUTES]
        );

        try {
            await sendMail(
                user.email,
                "Your EstateHomes password reset code",
                `Your password reset code is ${code}. It expires in ${RESET_CODE_TTL_MINUTES} minutes.\n\nIf you didn't request this, you can ignore this email.`
            );
        } catch (mailError) {
            // Still return the generic response so a mail failure doesn't reveal the account exists
            console.error("Failed to send password reset email:", mailError);
        }

        res.json(genericResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();

    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            res.status(400).json({ message: "Email, code and new password are required" });
            return;
        }

        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            res.status(400).json({
                message: "Password must be at least 8 characters and contain a letter and a number"
            });
            return;
        }

        const invalidCode = { message: "Invalid or expired reset code" };

        await client.query("BEGIN");

        // Lock the reset row so concurrent attempts can't bypass the attempt limit
        const resetResult = await client.query(
            `SELECT pr.id, pr.user_id, pr.code_hash, pr.attempts
             FROM password_resets pr
             JOIN users u ON u.id = pr.user_id
             WHERE u.email = $1 AND pr.used_at IS NULL AND pr.expires_at > NOW()
             ORDER BY pr.created_at DESC
             LIMIT 1
             FOR UPDATE OF pr`,
            [email]
        );

        const reset = resetResult.rows[0];

        if (!reset || reset.attempts >= RESET_CODE_MAX_ATTEMPTS) {
            await client.query("ROLLBACK");
            res.status(400).json(invalidCode);
            return;
        }

        const codeMatch = await bcrypt.compare(String(code), reset.code_hash);

        if (!codeMatch) {
            await client.query("UPDATE password_resets SET attempts = attempts + 1 WHERE id = $1", [reset.id]);
            await client.query("COMMIT");
            res.status(400).json(invalidCode);
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, reset.user_id]);
        await client.query(
            "UPDATE password_resets SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL",
            [reset.user_id]
        );

        await client.query("COMMIT");

        res.json({ message: "Password reset successful" });
    } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
}
