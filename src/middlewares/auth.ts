import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    console.log('Raw Authorization header:', JSON.stringify(req.headers.authorization));

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || typeof authorizationHeader !== 'string') {
        return res.status(401).json({
            success: false,
            error: {
                message: 'No valid token provided.',
            },
            status: 401,
        });
    }

    if (/[^\x20-\x7E]/.test(authorizationHeader)) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Its error here! Invalid characters in authorization header.',
            },
            status: 400,
        });
    }

    const headerParts = authorizationHeader.split(' ');
    if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid token format.',
            },
            status: 401,
        });
    }
    const token = headerParts[1];


    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }
        req.userId = decoded.id;

        next();
    })
}