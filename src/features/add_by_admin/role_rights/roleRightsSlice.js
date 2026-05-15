// c:\Projects\NamoGange\new_admin_namogange\src\redux\slices\add_by_admin\roleRightsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { createActivityLogThunk } from "../../activityLog/activityLogSlice";

/* ===============================
   CREATE ROLE RIGHTS
================================ */
export const createRoleRights = createAsyncThunk(
    "roleRights/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post("/role-rights/create", data);
            dispatch(
                createActivityLogThunk({
                    user_id: data.user_id,
                    message: `Role Rights created for: ${data.role}`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/role-rights`,
                    section: "Role Rights",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   GET ALL ROLE RIGHTS
================================ */
export const getAllRoleRights = createAsyncThunk(
    "roleRights/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/role-rights");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   UPDATE ROLE RIGHTS
================================ */
export const updateRoleRights = createAsyncThunk(
    "roleRights/update",
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.put(`/role-rights/${id}`, data);
            dispatch(
                createActivityLogThunk({
                    user_id: data.user_id,
                    message: `Role Rights updated for: ${data.role}`,
                    link: `${import.meta.env.VITE_API_FRONT_URL}/role-rights`,
                    section: "Role Rights",
                })
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===============================
   DELETE ROLE RIGHTS
================================ */
export const deleteRoleRights = createAsyncThunk(
    "roleRights/delete",
    async ({ id, user_id }, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/role-rights/${id}`);
            dispatch(
                createActivityLogThunk({
                    user_id,
                    message: "Role Rights deleted",
                    link: `${import.meta.env.VITE_API_FRONT_URL}/role-rights`,
                    section: "Role Rights",
                })
            );
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const roleRightsSlice = createSlice({
    name: "roleRights",
    initialState: {
        roleRightsList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRoleRights.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoleRights.fulfilled, (state, action) => {
                state.loading = false;
                state.roleRightsList.unshift(action.payload);
            })
            .addCase(createRoleRights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllRoleRights.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllRoleRights.fulfilled, (state, action) => {
                state.loading = false;
                state.roleRightsList = action.payload;
            })
            .addCase(getAllRoleRights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateRoleRights.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRoleRights.fulfilled, (state, action) => {
                state.loading = false;
                state.roleRightsList = state.roleRightsList.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                );
            })
            .addCase(updateRoleRights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteRoleRights.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRoleRights.fulfilled, (state, action) => {
                state.loading = false;
                state.roleRightsList = state.roleRightsList.filter(
                    (item) => item._id !== action.payload
                );
            })
            .addCase(deleteRoleRights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default roleRightsSlice.reducer;