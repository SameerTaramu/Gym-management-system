import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("http://localhost:5005/api/plans");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    selectedPlan: null,
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    choosePlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    resetSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    resetStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = Array.isArray(action.payload.plans)
          ? action.payload.plans
          : Array.isArray(action.payload)
            ? action.payload
            : [];
      })

      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
},
});

export const { choosePlan, resetSelectedPlan, resetStatus } = planSlice.actions;
export default planSlice.reducer;
