import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

/* CREATE ACTIVITY LOG */
// export const createActivityLogThunk = createAsyncThunk(
//   "activityLog/create",
//   async ({ user_id, message, link, section }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/activity-logs/create", {
//         user_id,
//         message,
//         link,
//         section,
//       });
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   },
// );

export const createActivityLogThunk = createAsyncThunk(
  "activityLog/create",
  async (
    { user_id, message, link, section, data = {} },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/activity-logs/create", {
        user_id,
        message,
        link,
        section,
        data, // ✅ NEW
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* GET ALL LOGS (OPTIONAL) */
export const fetchActivityLogs = createAsyncThunk(
  "activityLog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/activity-logs");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createActivityLogThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createActivityLogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createActivityLogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activityLogSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/axiosInstance";

// /* ================= FETCH LOGS (WITH PAGINATION + FILTER) ================= */

// export const fetchActivityLogs = createAsyncThunk(
//   "activityLog/fetch",
//   async ({ page = 1, limit = 10, section = "" }, { rejectWithValue }) => {
//     try {
//       const query = `?page=${page}&limit=${limit}${
//         section ? `&section=${section}` : ""
//       }`;

//       const res = await api.get(`/activity-logs${query}`);

//       return res.data; // full response (total, page, totalPages, data)
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch logs",
//       );
//     }
//   },
// );

// /* ================= SLICE ================= */

// const activityLogSlice = createSlice({
//   name: "activityLog",
//   initialState: {
//     logs: [],
//     total: 0,
//     page: 1,
//     totalPages: 1,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearActivityError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       /* FETCH LOGS */
//       .addCase(fetchActivityLogs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchActivityLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.logs = action.payload.data;
//         state.total = action.payload.total;
//         state.page = action.payload.page;
//         state.totalPages = action.payload.totalPages;
//       })
//       .addCase(fetchActivityLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearActivityError } = activityLogSlice.actions;

// export default activityLogSlice.reducer;
