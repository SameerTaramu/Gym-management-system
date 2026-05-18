import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5005/api/trainer-hires";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchAvailableTrainers = createAsyncThunk(
  "trainerHire/fetchAvailableTrainers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/trainers`, getConfig());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch trainers"
      );
    }
  }
);

export const hireTrainer = createAsyncThunk(
  "trainerHire/hireTrainer",
  async ({ trainerId, periodType }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/hire`,
        { trainerId, periodType },
        getConfig()
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to hire trainer"
      );
    }
  }
);

export const fetchMyHiredTrainers = createAsyncThunk(
  "trainerHire/fetchMyHiredTrainers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/my-hires`, getConfig());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch hired trainers"
      );
    }
  }
);

export const cancelTrainerHire = createAsyncThunk(
  "trainerHire/cancelTrainerHire",
  async (hireId, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/cancel/${hireId}`, {}, getConfig());
      return { ...res.data, hireId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to cancel trainer hire"
      );
    }
  }
);

const trainerHireSlice = createSlice({
  name: "trainerHire",
  initialState: {
    trainers: [],
    myHires: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    resetTrainerHireStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTrainers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableTrainers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchAvailableTrainers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(hireTrainer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hireTrainer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        if (action.payload.hire) {
          state.myHires.unshift(action.payload.hire);
        }
      })
      .addCase(hireTrainer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(fetchMyHiredTrainers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyHiredTrainers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myHires = action.payload;
      })
      .addCase(fetchMyHiredTrainers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(cancelTrainerHire.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelTrainerHire.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.myHires = state.myHires.map((hire) =>
          hire._id === action.payload.hireId
            ? { ...hire, status: "Cancelled" }
            : hire
        );
      })
      .addCase(cancelTrainerHire.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTrainerHireStatus } = trainerHireSlice.actions;
export default trainerHireSlice.reducer;