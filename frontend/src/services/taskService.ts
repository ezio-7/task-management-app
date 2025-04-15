import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks/';

// Create axios instance with auth header
const createAxiosInstance = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return axios.create({
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
};

// Get all tasks
const getTasks = async () => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
};

// Create new task
const createTask = async (taskData: { title: string; description?: string; status?: string }) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.post(API_URL, taskData);
    return response.data.data;
};

// Update task
const updateTask = async (taskId: number, taskData: { title?: string; description?: string; status?: string }) => {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.put(API_URL + taskId, taskData);
    return response.data.data;
};

// Delete task
const deleteTask = async (taskId: number) => {
    const axiosInstance = createAxiosInstance();
    await axiosInstance.delete(API_URL + taskId);
};

const taskService = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};

export default taskService;