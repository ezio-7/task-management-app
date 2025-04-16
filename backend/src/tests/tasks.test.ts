// src/tests/tasks.test.ts
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Test user data
const testUser = {
  username: 'taskuser',
  password: 'password123'
};

let token: string;
let userId: number;

// Set up test user before all tests
beforeAll(async () => {
  // Clean up any existing data
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Create a test user directly in the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testUser.password, salt);
  
  const user = await prisma.user.create({
    data: {
      username: testUser.username,
      password: hashedPassword
    }
  });
  
  userId = user.id;
  
  // Generate a token
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
});

// Clean up after all tests
afterAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('Task Endpoints', () => {
  // Clean up tasks before each test
  beforeEach(async () => {
    await prisma.task.deleteMany({});
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          status: 'PENDING'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('title', 'Test Task');
      expect(res.body.data).toHaveProperty('description', 'This is a test task');
      expect(res.body.data).toHaveProperty('status', 'PENDING');
      expect(res.body.data).toHaveProperty('userId', userId);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'This is a test task',
          status: 'PENDING'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('status', 'error');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          status: 'PENDING'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create some tasks for testing
      await prisma.task.create({
        data: {
          title: 'Task 1',
          description: 'Description 1',
          status: 'PENDING',
          userId
        }
      });
      
      await prisma.task.create({
        data: {
          title: 'Task 2',
          description: 'Description 2',
          status: 'COMPLETED',
          userId
        }
      });
    });

    it('should get all tasks for the user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(2);
      expect(res.body.data[0]).toHaveProperty('title');
      expect(res.body.data[0]).toHaveProperty('description');
      expect(res.body.data[0]).toHaveProperty('status');
      expect(res.body.data[0]).toHaveProperty('userId', userId);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/tasks');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      // Create a task for testing
      const task = await prisma.task.create({
        data: {
          title: 'Task to Update',
          description: 'This task will be updated',
          status: 'PENDING',
          userId
        }
      });
      
      taskId = task.id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'COMPLETED'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('id', taskId);
      expect(res.body.data).toHaveProperty('title', 'Updated Task');
      expect(res.body.data).toHaveProperty('status', 'COMPLETED');
      expect(res.body.data).toHaveProperty('userId', userId);
    });

    it('should return 404 if task does not exist', async () => {
      const res = await request(app)
        .put('/api/tasks/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task',
          status: 'COMPLETED'
        });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 403 if user does not own the task', async () => {
      // Create another user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const anotherUser = await prisma.user.create({
        data: {
          username: 'anotheruser',
          password: hashedPassword
        }
      });
      
      // Create a task for the other user
      const otherTask = await prisma.task.create({
        data: {
          title: 'Other User Task',
          description: 'This task belongs to another user',
          status: 'PENDING',
          userId: anotherUser.id
        }
      });
      
      const res = await request(app)
        .put(`/api/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Trying to update other user task',
          status: 'COMPLETED'
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Not authorized to update this task');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      // Create a task for testing
      const task = await prisma.task.create({
        data: {
          title: 'Task to Delete',
          description: 'This task will be deleted',
          status: 'PENDING',
          userId
        }
      });
      
      taskId = task.id;
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Task deleted');
      
      // Verify task is deleted
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });
      
      expect(task).toBeNull();
    });

    it('should return 404 if task does not exist', async () => {
      const res = await request(app)
        .delete('/api/tasks/9999')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Task not found');
    });

    it('should return 403 if user does not own the task', async () => {
      // Create another user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const anotherUser = await prisma.user.create({
        data: {
          username: 'anotheruser2',
          password: hashedPassword
        }
      });
      
      // Create a task for the other user
      const otherTask = await prisma.task.create({
        data: {
          title: 'Other User Task',
          description: 'This task belongs to another user',
          status: 'PENDING',
          userId: anotherUser.id
        }
      });
      
      const res = await request(app)
        .delete(`/api/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Not authorized to delete this task');
    });
  });
});