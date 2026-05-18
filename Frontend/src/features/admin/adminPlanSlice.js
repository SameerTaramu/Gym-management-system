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

export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/admin/memberships",
        getConfig()
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (planData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/admin/memberships",
        planData,
        getConfig()
      );
      return data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create plan"
      );
    }
  }
);

export const deletePlan = createAsyncThunk(
  "plans/deletePlan",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5005/api/admin/memberships/${id}`,
        getConfig()
      );
      return data._id; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete plan"
      );
    }
  }
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
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
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.plans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deletePlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.plans = state.plans.filter((plan) => plan._id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetStatus } = planSlice.actions;
export default planSlice.reducer;
