import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
    id: number;
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Not authorized, no token'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Get user from token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Not authorized, user not found'
            });
            return;
        }

        // Set user in request
        req.user = { id: user.id };
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Not authorized, invalid token'
        });
    }
};