import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createActivityLogThunk } from '../activityLog/activityLogSlice';

// const API_URL = "http://localhost:5000/api/roles";
const API_URL = `${import.meta.env.VITE_API_URL}/roles`;
// const BASE_URL = `${API_URL}`;

// Helper function for auth headers
const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
});

export const addRole = createAsyncThunk('roles/addRole', async (roleData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, roleData, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Created new role: ${roleData.roleName}`,
            section: 'Roles',
            link: '/roles'
        }));
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add role');
    }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Updated role: ${data.roleName}`,
            section: 'Roles',
            link: '/roles'
        }));
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id, { dispatch, rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Deleted a role`,
            section: 'Roles',
            link: '/roles'
        }));
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
});

const roleSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        loading: false,
        actionLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Roles
            .addCase(fetchRoles.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRoles.fulfilled, (state, action) => { state.loading = false; state.roles = action.payload; })
            .addCase(fetchRoles.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Add Role
            .addCase(addRole.pending, (state) => { state.actionLoading = true; })
            .addCase(addRole.fulfilled, (state, action) => { state.actionLoading = false; state.roles.unshift(action.payload); })
            .addCase(addRole.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })
            // Update Role
            .addCase(updateRole.pending, (state) => { state.actionLoading = true; })
            .addCase(updateRole.fulfilled, (state, action) => { state.actionLoading = false; const index = state.roles.findIndex(r => r._id === action.payload._id); if (index !== -1) state.roles[index] = action.payload; })
            .addCase(updateRole.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })
            // Delete Role
            .addCase(deleteRole.pending, (state) => { state.actionLoading = true; })
            .addCase(deleteRole.fulfilled, (state, action) => { state.actionLoading = false; state.roles = state.roles.filter(r => r._id !== action.payload); })
            .addCase(deleteRole.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; });
    }
});

export const { clearError } = roleSlice.actions;
export default roleSlice.reducer;