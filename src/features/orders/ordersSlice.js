import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchCompanyOrders = createAsyncThunk(
  'orders/fetchCompanyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/company-orders`, getAuthHeader());
      return response.data.data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeader());
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCompanyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default ordersSlice.reducer;
