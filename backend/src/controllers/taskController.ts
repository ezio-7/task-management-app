import { Request, Response } from 'express';
import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: req.user!.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            status: 'success',
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            res.status(400).json({
                status: 'error',
                message: 'Please provide a title'
            });
            return;
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status ? status as TaskStatus : 'PENDING',
                userId: req.user!.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
            return;
        }

        if (task.userId !== req.user!.id) {
            res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this task'
            });
            return;
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title: title || task.title,
                description: description !== undefined ? description : task.description,
                status: status ? status as TaskStatus : task.status
            }
        });

        res.status(200).json({
            status: 'success',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
            return;
        }

        if (task.userId !== req.user!.id) {
            res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this task'
            });
            return;
        }

        await prisma.task.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            status: 'success',
            message: 'Task deleted'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};