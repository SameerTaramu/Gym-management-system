import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const buyMembershipCash = createAsyncThunk(
  "membership/buyCash",
  async (planId, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/membership/cash",
        { planId },
        getConfig()
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Cash purchase failed"
      );
    }
  }
);
export const renewMembership = createAsyncThunk(
  "membership/renew",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/membership/renew",
        {},
        getConfig()
      );
      return data.membership;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Renew failed"
      );
    }
  }
);



export const cancelMembership = createAsyncThunk(
  "membership/cancel",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        "http://localhost:5005/api/membership/cancel",
        getConfig()
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to cancel membership"
      );
    }
  }
);

export const fetchMembership = createAsyncThunk(
  "membership/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/membership",
        getConfig()
      );
      return data.membership;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch membership"
      );
    }
  }
);

const membershipSlice = createSlice({
  name: "membership",
  initialState: {
    membership: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    esewaLoading: {},
    message: "",
  },
  reducers: {
    resetStatus: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setMembership: (state, action) => {
      state.membership = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyMembershipCash.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(buyMembershipCash.fulfilled, (state, action) => {
  state.isLoading = false;
  state.membership = action.payload.membership;
  state.isSuccess = true;
})
      .addCase(buyMembershipCash.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(renewMembership.fulfilled, (state, action) => {
        state.membership = action.payload;
        state.isLoading = false;
      })
      .addCase(cancelMembership.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(cancelMembership.fulfilled, (state) => {
        state.isLoading = false;
        state.membership = null;
        state.isSuccess = true;
      })
      .addCase(cancelMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchMembership.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.membership = action.payload;
      })
      .addCase(fetchMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStatus, setMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
