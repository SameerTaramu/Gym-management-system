import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5005/api";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchTrainers = createAsyncThunk(
  "trainers/fetchTrainers",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/admin/trainers`,
        getConfig()
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch trainers"
      );
    }
  }
);

export const createTrainer = createAsyncThunk(
  "trainers/createTrainer",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/admin/trainers`,
        formData,
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create trainer"
      );
    }
  }
);

export const toggleTrainerStatus = createAsyncThunk(
  "trainers/toggleTrainerStatus",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/admin/trainers/${id}/status`,
        {},
        getConfig()
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update trainer status"
      );
    }
  }
);



const trainerSlice = createSlice({
  name: "trainers",
  initialState: {
    trainers: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchTrainers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createTrainer.fulfilled, (state, action) => {
        state.trainers.unshift(action.payload);
      })
      .addCase(createTrainer.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(toggleTrainerStatus.fulfilled, (state, action) => {
        const trainer = state.trainers.find(
          (t) => t._id === action.payload._id
        );
        if (trainer) trainer.isActive = action.payload.isActive;
      })
  },
});

export default trainerSlice.reducer;
