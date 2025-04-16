import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                status: 'error',
                message: 'Please provide username and password'
            });
            return;
        }

        const userExists = await prisma.user.findUnique({
            where: { username }
        });

        if (userExists) {
            res.status(400).json({
                status: 'error',
                message: 'User already exists'
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                data: {
                    id: user.id,
                    username: user.username,
                    token: generateToken(user.id)
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                status: 'error',
                message: 'Please provide username and password'
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                id: user.id,
                username: user.username,
                token: generateToken(user.id)
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};