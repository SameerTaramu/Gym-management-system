import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5005/api/admin";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const fetchAdminStats = createAsyncThunk(
  "adminStats/fetchAdminStats",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/stats`, getConfig());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: {
    stats: null,
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetAdminStatsState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAdminStatsState } = adminStatsSlice.actions;
export default adminStatsSlice.reducer;