import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
};

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/bookings/my",
        getConfig(),
      );

      return Array.isArray(data) ? data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load bookings",
      );
    }
  },
);

export const bookClass = createAsyncThunk(
  "bookings/bookClass",
  async (classId, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/bookings/book",
        { classId },
        getConfig(),
      );

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Booking failed",
      );
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5005/api/bookings/cancel/${bookingId}`,
        {},
        getConfig(),
      );

      return data.booking;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Cancel failed",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    lastQr: null,
  },

  reducers: {
    resetStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.bookings = [];
      })

      .addCase(bookClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const { booking } = action.payload;

        const exists = state.bookings.find((b) => b._id === booking._id);

        if (!exists) {
          state.bookings.unshift(booking);
        }

        state.lastQr = action.payload.booking.qrImage;
      })
      .addCase(bookClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;

        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b,
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
