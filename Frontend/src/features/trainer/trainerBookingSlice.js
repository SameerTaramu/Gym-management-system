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

export const fetchTrainerBookings = createAsyncThunk(
  "trainerBookings/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:5005/api/trainer/bookings",
        getConfig(),
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

const trainerBookingSlice = createSlice({
  name: "trainerBookings",
  initialState: {
    bookings: [],
    isLoading: false,
    isError: false,
    message: "",
  },

  reducers: {
    resetStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
      markAttendanceLocal: (state, action) => {
          const bookingId = action.payload;
    
          state.bookings = state.bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, attended: true, status: "Completed" }
              : booking,
          );
        },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainerBookings.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchTrainerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })

      .addCase(fetchTrainerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStatus, markAttendanceLocal } = trainerBookingSlice.actions;
export default trainerBookingSlice.reducer;
