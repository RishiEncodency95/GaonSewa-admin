// src/redux/slices/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/companies`;


// ================= THUNKS =================

// CREATE COMPANY
export const createCompany = createAsyncThunk(
    "company/create",
    async (data, thunkAPI) => {
        try {
            const res = await axios.post(BASE_URL, data);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// GET ALL COMPANIES
export const getCompanies = createAsyncThunk(
    "company/getAll",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(BASE_URL);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// GET SINGLE COMPANY + BRANCHES
export const getCompany = createAsyncThunk(
    "company/getOne",
    async (id, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/${id}`);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// UPDATE COMPANY
export const updateCompany = createAsyncThunk(
    "company/update",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axios.put(`${BASE_URL}/${id}`, data);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// DELETE COMPANY
export const deleteCompany = createAsyncThunk(
    "company/delete",
    async (id, thunkAPI) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);



// ================= SLICE =================

const companySlice = createSlice({
    name: "company",

    initialState: {
        companies: [],
        company: null,

        loading: false,
        error: null,
        success: false,

        // action specific loading
        createLoading: false,
        updateLoading: false,
        deleteLoading: false
    },

    reducers: {
        resetCompanyState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },

        clearCompany: (state) => {
            state.company = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // ================= CREATE =================
            .addCase(createCompany.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createCompany.fulfilled, (state, action) => {
                state.createLoading = false;
                state.success = true;

                // API returns { company, branch }
                state.companies.push(action.payload.company);
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })


            // ================= GET ALL =================
            .addCase(getCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload;
            })
            .addCase(getCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ================= GET ONE =================
            .addCase(getCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload.company;
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ================= UPDATE =================
            .addCase(updateCompany.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.success = true;

                state.companies = state.companies.map((c) =>
                    c._id === action.payload.company._id
                        ? action.payload.company
                        : c
                );

                // also update single view
                if (state.company?._id === action.payload.company._id) {
                    state.company = action.payload.company;
                }
            })
            .addCase(updateCompany.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })


            // ================= DELETE =================
            .addCase(deleteCompany.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;

                state.companies = state.companies.filter(
                    (c) => c._id !== action.payload
                );
            })
            .addCase(deleteCompany.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCompanyState, clearCompany } = companySlice.actions;

export default companySlice.reducer;