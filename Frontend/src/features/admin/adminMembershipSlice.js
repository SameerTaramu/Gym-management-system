import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchPendingMemberships = createAsyncThunk(
  "adminMembership/fetchPending",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/admin/memberships/pending",
        getConfig()
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch pending memberships"
      );
    }
  }
);

export const approveMembership = createAsyncThunk(
  "adminMembership/approve",
  async (userId, thunkAPI) => {
    try {
      await axios.put(
        `http://localhost:5005/api/admin/memberships/approve/${userId}`,
        {},
        getConfig()
      );
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to approve membership"
      );
    }
  }
);

export const rejectMembership = createAsyncThunk(
  "adminMembership/reject",
  async (userId, thunkAPI) => {
    try {
      await axios.delete(
        `http://localhost:5005/api/admin/memberships/reject/${userId}`,
        getConfig()
      );
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to reject membership"
      );
    }
  }
);

const adminMembershipSlice = createSlice({
  name: "adminMembership",
  initialState: {
    pending: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetAdminStatus: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingMemberships.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPendingMemberships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingMemberships.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(approveMembership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pending = state.pending.filter(
          (u) => u._id !== action.payload
        );
      })
      .addCase(approveMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      
      .addCase(rejectMembership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pending = state.pending.filter(
          (u) => u._id !== action.payload
        );
      })
      .addCase(rejectMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAdminStatus } = adminMembershipSlice.actions;
export default adminMembershipSlice.reducer;
