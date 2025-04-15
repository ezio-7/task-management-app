import express from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

export default router;