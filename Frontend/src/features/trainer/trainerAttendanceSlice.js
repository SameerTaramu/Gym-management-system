import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const verifyAttendance = createAsyncThunk(
  "trainerAttendance/verify",
  async ({ token }, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:5005/api/attendance/verify",
        { token },
        getConfig(),
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

const trainerAttendanceSlice = createSlice({
  name: "trainerAttendance",
  initialState: {
    loading: false,
    success: false,
    error: false,
    message: "",
  },
  reducers: {
    resetAttendanceState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      });
  },
});

export const { resetAttendanceState } = trainerAttendanceSlice.actions;
export default trainerAttendanceSlice.reducer;
