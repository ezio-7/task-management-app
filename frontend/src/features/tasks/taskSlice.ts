/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'PENDING' | 'COMPLETED';
    userId: number;
    createdAt: string;
    updatedAt: string;
}

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
}

const initialState: TaskState = {
    tasks: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => {
    try {
        return await taskService.getTasks();
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return thunkAPI.rejectWithValue(message);
    }
});

export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData: { title: string; description?: string; status?: string }, thunkAPI) => {
        try {
            return await taskService.createTask(taskData);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async (
        { taskId, taskData }: {
            taskId: number;
            taskData: { title?: string; description?: string; status?: string }
        },
        thunkAPI
    ) => {
        try {
            return await taskService.updateTask(taskId, taskData);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId: number, thunkAPI) => {
    try {
        await taskService.deleteTask(taskId);
        return taskId;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return thunkAPI.rejectWithValue(message);
    }
});

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;