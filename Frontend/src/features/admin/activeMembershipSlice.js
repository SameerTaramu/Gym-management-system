// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const getConfig = () => {
//   const token = JSON.parse(localStorage.getItem("user"))?.token;
//   return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
// };


// export const fetchActiveMemberships = createAsyncThunk(
//   "admin/fetchActiveMemberships",
//   async (_, thunkAPI) => {
//     try {
//       const token = JSON.parse(localStorage.getItem("user"))?.token;
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const { data } = await axios.get(
//         "http://localhost:5000/api/admin/memberships/active",
//         config
//       );
//       return data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch active memberships");
//     }
//   }
// );

// export const toggleMembershipStatus = createAsyncThunk(
//   "admin/toggleMembershipStatus",
//   async (userId, thunkAPI) => {
//     try {
//       const { data } = await axios.put(`/api/admin/memberships/${userId}/toggle`, {}, getConfig());
//       return data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update status");
//     }
//   }
// );


// const activeMembershipSlice = createSlice({
//   name: "activeMemberships",
//   initialState: {
//     memberships: [],
//     isLoading: false,
//     isError: false,
//     message: "",
//   },
//   reducers: {
//     resetStatus: (state) => {
//       state.isError = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchActiveMemberships.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchActiveMemberships.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.memberships = action.payload;
//       })
//       .addCase(fetchActiveMemberships.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       .addCase(toggleMembershipStatus.fulfilled, (state, action) => {
//         const idx = state.memberships.findIndex(m => m._id === action.payload._id);
//         if (idx !== -1) state.memberships[idx].membership.isActive = action.payload.membershipStatus;
//       });
//   },
// });

// export const { resetStatus } = activeMembershipSlice.actions;
// export default activeMembershipSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getConfig = () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchActiveMemberships = createAsyncThunk(
  "admin/fetchActiveMemberships",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("http://localhost:5005/api/admin/memberships/active", getConfig());
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch memberships";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deactivateMembership = createAsyncThunk(
  "activeMemberships/deactivate",
  async (userId, thunkAPI) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.put(`http://localhost:5005/api/admin/memberships/deactivate/${userId}`, {}, config);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to deactivate membership");
    }
  }
);

const activeMembershipSlice = createSlice({
  name: "activeMemberships",
  initialState: {
    memberships: [],
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
      
      .addCase(fetchActiveMemberships.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchActiveMemberships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.memberships = action.payload;
      })
      .addCase(fetchActiveMemberships.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
        .addCase(deactivateMembership.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deactivateMembership.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;

  state.memberships = state.memberships.map((user) =>
    user._id === action.payload._id
      ? { ...user, membership: action.payload.membership }
      : user
  );
})

      .addCase(deactivateMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
      
  },
});

export const { resetStatus } = activeMembershipSlice.actions;
export default activeMembershipSlice.reducer;
