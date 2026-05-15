import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createActivityLogThunk } from '../activityLog/activityLogSlice';

const API_URL = `${import.meta.env.VITE_API_URL}/sidebars`;

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchSidebars = createAsyncThunk('sidebars/fetchSidebars', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch sidebars');
    }
});

export const addSidebar = createAsyncThunk('sidebars/addSidebar', async (sidebarData, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, sidebarData, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Created new sidebar item: ${sidebarData.label}`,
            section: 'Sidebar',
            link: '/addSidebar'
        }));
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add sidebar');
    }
});

export const updateSidebar = createAsyncThunk('sidebars/updateSidebar', async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Updated sidebar item: ${data.label}`,
            section: 'Sidebar',
            link: '/addSidebar'
        }));
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update sidebar');
    }
});

export const deleteSidebar = createAsyncThunk('sidebars/deleteSidebar', async (id, { dispatch, rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(createActivityLogThunk({
            user_id: user?._id || user?.id,
            message: `Deleted a sidebar item`,
            section: 'Sidebar',
            link: '/addSidebar'
        }));
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete sidebar');
    }
});

const sidebarSlice = createSlice({
    name: 'sidebars',
    initialState: {
        sidebars: [],
        loading: false,
        isFetched: false,
        actionLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSidebars.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSidebars.fulfilled, (state, action) => { state.loading = false; state.sidebars = action.payload; state.isFetched = true; })
            .addCase(fetchSidebars.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.isFetched = true; })

            .addCase(addSidebar.pending, (state) => { state.actionLoading = true; })
            .addCase(addSidebar.fulfilled, (state, action) => { state.actionLoading = false; state.sidebars.unshift(action.payload); })
            .addCase(addSidebar.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

            .addCase(updateSidebar.pending, (state) => { state.actionLoading = true; })
            .addCase(updateSidebar.fulfilled, (state, action) => { state.actionLoading = false; const index = state.sidebars.findIndex(s => s._id === action.payload._id); if (index !== -1) state.sidebars[index] = action.payload; })
            .addCase(updateSidebar.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

            .addCase(deleteSidebar.pending, (state) => { state.actionLoading = true; })
            .addCase(deleteSidebar.fulfilled, (state, action) => { state.actionLoading = false; state.sidebars = state.sidebars.filter(s => s._id !== action.payload); })
            .addCase(deleteSidebar.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; });
    }
});

export const { clearError } = sidebarSlice.actions;
export default sidebarSlice.reducer;