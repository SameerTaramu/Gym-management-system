import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5005/api/trainer-hires";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const fetchTrainerClients = createAsyncThunk(
  "trainerClients/fetchTrainerClients",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/clients`, getConfig());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch trainer clients"
      );
    }
  }
);

const trainerClientSlice = createSlice({
  name: "trainerClients",
  initialState: {
    clients: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetTrainerClientStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainerClients.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchTrainerClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(fetchTrainerClients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTrainerClientStatus } = trainerClientSlice.actions;
export default trainerClientSlice.reducer;