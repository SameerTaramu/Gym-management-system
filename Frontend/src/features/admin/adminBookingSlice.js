// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const getConfig = () => {
//   const token = JSON.parse(localStorage.getItem("user"))?.token;
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// export const fetchBookings = createAsyncThunk(
//   "adminBookings/fetch",
//   async (_, thunkAPI) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admin/bookings", getConfig());
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// const adminBookingSlice = createSlice({
//   name: "adminBookings",
//   initialState: {
//     bookings: [],
//     isLoading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBookings.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchBookings.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.bookings = action.payload;
//       });
//   },
// });

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchBookings = createAsyncThunk(
  "adminBookings/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5005/api/admin/bookings", getConfig());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "adminBookings/delete",
  async (bookingId, thunkAPI) => {
    try {
      const res = await axios.delete(`http://localhost:5005/api/admin/bookings/${bookingId}`, getConfig());
      return res.data._id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminBookingSlice = createSlice({
  name: "adminBookings",
  initialState: {
    bookings: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
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
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStatus } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;
