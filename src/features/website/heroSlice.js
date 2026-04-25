import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/hero`;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchHeroes = createAsyncThunk("hero/fetchHeroes", async (_, thunkAPI) => {
    try {
        const { data } = await axios.get(API_URL, getAuthHeader());
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.heroes)) return data.heroes;
        if (Array.isArray(data.data)) return data.data;

        // Handle single object response from API (Agar API sirf 1 record return kare object format me)
        if (data && typeof data === 'object') {
            if (data._id) return [data];
            if (data.data && data.data._id) return [data.data];
        }

        return [];
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchHeroById = createAsyncThunk("hero/fetchHeroById", async (id, thunkAPI) => {
    try {
        const { data } = await axios.get(`${API_URL}/${id}`, getAuthHeader());
        return data.hero || data.data || data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const addHero = createAsyncThunk("hero/addHero", async (formData, thunkAPI) => {
    try {
        const { data } = await axios.post(API_URL, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // Content-Type axios khud set kar deta hai FormData ke liye
            },
        });
        return data.hero || data.data || data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateHero = createAsyncThunk("hero/updateHero", async ({ id, formData }, thunkAPI) => {
    try {
        const { data } = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return data.hero || data.data || data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteHero = createAsyncThunk("hero/deleteHero", async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// ── SLICE ────────────────────────────────────────────────────────────────────

const heroSlice = createSlice({
    name: "hero",
    initialState: {
        heroes: [],
        selectedHero: null,
        loading: false,
        actionLoading: false,
        error: null,
    },
    reducers: {
        clearSelectedHero: (state) => {
            state.selectedHero = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // ── FETCH ALL ──
            .addCase(fetchHeroes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.loading = false;
                state.heroes = action.payload;
                state.error = null;
            })
            .addCase(fetchHeroes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── FETCH BY ID ──
            .addCase(fetchHeroById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedHero = null;
            })
            .addCase(fetchHeroById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHero = action.payload;
                state.error = null;
            })
            .addCase(fetchHeroById.rejected, (state, action) => {
                state.loading = false;
                state.selectedHero = null;
                state.error = action.payload;
            })

            // ── ADD ──
            .addCase(addHero.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addHero.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.heroes.push(action.payload);
                state.error = null;
            })
            .addCase(addHero.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // ── UPDATE ──
            .addCase(updateHero.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateHero.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.heroes.findIndex((h) => h._id === action.payload._id);
                if (index !== -1) state.heroes[index] = action.payload;
                if (state.selectedHero?._id === action.payload._id) state.selectedHero = action.payload;
                state.error = null;
            })
            .addCase(updateHero.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // ── DELETE ──
            .addCase(deleteHero.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteHero.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.heroes = state.heroes.filter((h) => h._id !== action.payload);
                if (state.selectedHero?._id === action.payload) state.selectedHero = null;
                state.error = null;
            })
            .addCase(deleteHero.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelectedHero, clearError } = heroSlice.actions;
export default heroSlice.reducer;