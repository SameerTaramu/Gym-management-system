import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getConfig = (isFormData = false) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData && { "Content-Type": "multipart/form-data" }),
    },
  };
};


const toFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const fetchClasses = createAsyncThunk(
  "classes/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5005/api/admin/classes",
        getConfig()
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
);

export const createClass = createAsyncThunk(
  "classes/create",
  async (classData, thunkAPI) => {
    try {
      const formData = toFormData(classData);

      const { data } = await axios.post(
        "http://localhost:5005/api/admin/classes",
        formData,
        getConfig(true)
      );

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create class"
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  "classes/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      const formData = toFormData(updates);

      const { data } = await axios.put(
        `http://localhost:5005/api/admin/classes/${id}`,
        formData,
        getConfig(true)
      );

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update class"
      );
    }
  }
);

export const deleteClass = createAsyncThunk(
  "classes/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(
        `http://localhost:5005/api/admin/classes/${id}`,
        getConfig()
      );
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete class"
      );
    }
  }
);
export const reopenClass = createAsyncThunk(
  "classes/reopen",
  async ({ id, startTime, durationMinutes, slots, image }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("startTime", startTime);
      formData.append("durationMinutes", durationMinutes);
      formData.append("slots", slots);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        `http://localhost:5005/api/admin/classes/reopen/${id}`,
        formData,
        getConfig(true) 
      );

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Reopen failed"
      );
    }
  }
);



const classSlice = createSlice({
  name: "adminClasses",
  initialState: {
    classes: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },

  reducers: {
    resetClassStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes.unshift(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.classes = state.classes.map((cls) =>
          cls._id === action.payload._id ? action.payload : cls
        );
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.classes = state.classes.filter(
          (cls) => cls._id !== action.payload
        );
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
.addCase(reopenClass.fulfilled, (state, action) => {
  state.isLoading = false;

  const reopened = action.payload;
  if (!reopened || !reopened._id) return;

  state.classes = state.classes.map((cls) =>
    cls._id === reopened._id ? reopened : cls
  );

  state.isSuccess = true;
});


  },
});

export const { resetClassStatus } = classSlice.actions;
export default classSlice.reducer;
