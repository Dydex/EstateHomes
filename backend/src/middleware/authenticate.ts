import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/jwt.js';


export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                message: 'Authentication required'
            })
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Authentication token msissing"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
         ) as JwtPayload;

         req.user = decoded;

         next();

    } catch (error) {
        console.error("Error authenticating:", error);
        res.status(500).json({ message: "Failed to authenticate" });
    }
}