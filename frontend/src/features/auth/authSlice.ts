/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';

interface User {
    id: number;
    username: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
}

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
    user: user,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        return thunkAPI.rejectWithValue('Not authenticated');
    }
});

export const register = createAsyncThunk(
    'auth/register',
    async (userData: { username: string; password: string }, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (userData: { username: string; password: string }, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;