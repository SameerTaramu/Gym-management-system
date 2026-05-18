import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/classes",
        getConfig()
      );

      return Array.isArray(data) ? data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
);

export const fetchRecommendedClasses = createAsyncThunk(
  "classes/fetchRecommendedClasses",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/classes/recommended",
        getConfig()
      );

      return Array.isArray(data?.recommendations) ? data.recommendations : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recommended classes"
      );
    }
  }
);

export const fetchSearchedClasses = createAsyncThunk(
  "classes/fetchSearchedClasses",
  async (query, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5005/api/classes/search?query=${encodeURIComponent(query)}`,
        getConfig()
      );

      return Array.isArray(data?.results) ? data.results : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to search classes"
      );
    }
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    classes: [],
    recommendedClasses: [],
    searchedClasses: [],
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload.map((cls) => ({
          ...cls,
          isBookable: cls.isBookable,
          remainingSlots: cls.remainingSlots,
        }));
      })

      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.classes = [];
      })

      .addCase(fetchRecommendedClasses.pending, (state) => {
        state.isError = false;
      })

      .addCase(fetchRecommendedClasses.fulfilled, (state, action) => {
        state.recommendedClasses = action.payload.map((cls) => ({
          ...cls,
          isBookable: cls.isBookable,
          remainingSlots: cls.remainingSlots,
        }));
      })

      .addCase(fetchRecommendedClasses.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.recommendedClasses = [];
      })

      .addCase(fetchSearchedClasses.pending, (state) => {
        state.isError = false;
      })

      .addCase(fetchSearchedClasses.fulfilled, (state, action) => {
        state.searchedClasses = action.payload.map((cls) => ({
          ...cls,
          isBookable: cls.isBookable,
          remainingSlots: cls.remainingSlots,
        }));
      })

      .addCase(fetchSearchedClasses.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.searchedClasses = [];
      });
  },
});

export const { resetStatus } = classSlice.actions;
export default classSlice.reducer;