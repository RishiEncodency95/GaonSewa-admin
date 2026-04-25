import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, getAuthHeader());
      return response.data.data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'inventory/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, productData, getAuthHeader());
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProductById = createAsyncThunk(
  'inventory/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Delete
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;
