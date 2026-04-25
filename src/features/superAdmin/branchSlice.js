// src/redux/slices/branchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/companies`;
const BASE_URL = `${API_URL}`;

// ================= THUNKS =================

// CREATE
export const createBranch = createAsyncThunk(
  "branch/create",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/branches`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET
export const getBranches = createAsyncThunk(
  "branch/getAll",
  async (companyId, thunkAPI) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/branches/company/${companyId}`
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE
export const updateBranch = createAsyncThunk(
  "branch/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/branches/${id}`,
        data
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE
export const deleteBranch = createAsyncThunk(
  "branch/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/branches/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);



// ================= SLICE =================

const branchSlice = createSlice({
  name: "branch",
  initialState: {
    branches: [],

    loading: false,
    error: null,

    success: false,

    // action specific loading
    createLoading: false,
    updateLoading: false,
    deleteLoading: false
  },

  reducers: {
    resetBranchState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearBranches: (state) => {
      state.branches = [];
    }
  },

  extraReducers: (builder) => {
    builder

      // ================= CREATE =================
      .addCase(createBranch.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.branches.push(action.payload.branch);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ================= GET =================
      .addCase(getBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateBranch.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        state.branches = state.branches.map((b) =>
          b._id === action.payload.branch._id
            ? action.payload.branch
            : b
        );
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteBranch.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;

        state.branches = state.branches.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  }
});

export const { resetBranchState, clearBranches } = branchSlice.actions;

export default branchSlice.reducer;