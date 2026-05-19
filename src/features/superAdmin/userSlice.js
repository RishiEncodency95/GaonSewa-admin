import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createActivityLogThunk } from '../activityLog/activityLogSlice';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const getMultipartHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
    }
});

export const fetchUsersByBranch = createAsyncThunk('user/fetchByBranch', async (branchId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_URL}/branch/${branchId}`, getAuthHeader());
        return res.data.data.users;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
});

export const fetchAllUsers = createAsyncThunk('user/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(API_URL, getAuthHeader());
        return res.data.data.users;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
});

export const createUser = createAsyncThunk('user/create', async (data, { dispatch, rejectWithValue }) => {
    try {
        const res = await axios.post(API_URL, data, getMultipartHeader());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Created new user: ${data.get?.('name') || data.name || 'User'}`,
            section: 'Users',
            link: '/users'
        }));
        return res.data.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create user');
    }
});

export const updateUser = createAsyncThunk('user/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
        const res = await axios.patch(`${API_URL}/${id}`, data, getMultipartHeader());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Updated user: ${data.get?.('name') || data.name || 'User'}`,
            section: 'Users',
            link: '/users'
        }));
        return res.data.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update user');
    }
});

export const deleteUser = createAsyncThunk('user/delete', async (id, { dispatch, rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Deleted a user`,
            section: 'Users',
            link: '/users'
        }));
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: { users: [], loading: false, error: null },
    reducers: {
        clearUserError: (state) => { state.error = null; },
        clearUsers: (state) => { state.users = []; }
    },
    extraReducers: (builder) => {
        const pending = (state) => { state.loading = true; state.error = null; };
        const failed = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(fetchUsersByBranch.pending, pending)
            .addCase(fetchUsersByBranch.fulfilled, (state, action) => {
                state.loading = false; state.users = action.payload;
            })
            .addCase(fetchUsersByBranch.rejected, failed)

            .addCase(fetchAllUsers.pending, pending)
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false; state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, failed)

            .addCase(createUser.pending, pending)
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.unshift(action.payload);
            })
            .addCase(createUser.rejected, failed)

            .addCase(updateUser.pending, pending)
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.users.findIndex(u => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(updateUser.rejected, failed)

            .addCase(deleteUser.pending, pending)
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(deleteUser.rejected, failed);
    }
});

export const { clearUserError, clearUsers } = userSlice.actions;
export default userSlice.reducer;
