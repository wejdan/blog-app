import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData, refreshAuthToken } from "../services/auth";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, thunkAPI) => {
    try {
      const currentState = thunkAPI.getState().auth;
      if (currentState.isFetchingUserData) {
        // Fetch is already in progress, so don't start another
        return;
      }
      thunkAPI.dispatch(setIsFetchingUserData(true)); // Set the flag to true
      const token = currentState.accessToken;
      const results = await getUserData(token);

      return results;
    } catch (error) {
      if (error.status === 401) {
        // Assuming error.status is set correctly
        try {
          const newTokens = await thunkAPI
            .dispatch(refreshAuthTokens())
            .unwrap();

          // Retry the query with new tokens

          const results = await getUserData(newTokens.accessToken);

          return results;
        } catch (refreshError) {
          // Refresh token failed; log out the user
          console.log("error", error);
          thunkAPI.dispatch(logoutAction());
          return thunkAPI.rejectWithValue(error.message);
        }
      } else {
        console.log("error", error);
        thunkAPI.dispatch(logoutAction());
        return thunkAPI.rejectWithValue(error.message);
      }
    } finally {
      thunkAPI.dispatch(setIsFetchingUserData(false)); // Reset the flag to false
    }
  }
);

export const refreshAuthTokens = createAsyncThunk(
  "auth/refreshAuthTokens",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();

    // Check if a refresh token request is already in progress
    if (auth.isRefreshingToken) {
      // Reject the action if already refreshing to prevent multiple calls
      return rejectWithValue("Refresh token request already in progress");
    }

    // Indicate that refresh token request is in progress
    dispatch(setIsRefreshingToken(true));

    try {
      const result = await refreshAuthToken(auth.refreshToken);
      // Update the tokens in the Redux store
      dispatch(
        setTokens({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
      return result;
    } catch (error) {
      // Handle error (e.g., log out the user if refresh token is invalid)
      dispatch(logoutAction());
      return rejectWithValue(error.message);
    } finally {
      // Indicate that refresh token request is no longer in progress
      dispatch(setIsRefreshingToken(false));
    }
  }
);
const initialState = {
  user: null,
  userData: null,
  error: null,
  isAuthenticating: false,
  refreshToken: null,
  accessToken: null,
  isFetchingUserData: false,
  isRefreshingToken: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      //  console.log("payload.user", payload.user);
      state.user = payload.user.uid;
      state.accessToken = payload.user.accessToken; // Clear the stored token
      state.refreshToken = payload.user.refreshToken; // Clear the stored token
      //  console.log('newState', state);
    },
    setIsFetchingUserData(state, action) {
      state.isFetchingUserData = action.payload;
    },
    setIsRefreshingToken: (state, action) => {
      state.isRefreshingToken = action.payload;
    },
    setTokens: (state, action) => {
      const { payload } = action;

      state.accessToken = payload.accessToken; // Clear the stored token
      state.refreshToken = payload.refreshToken; // Clear the stored token
    },
    setIsAuthenticating: (state, action) => {
      const { payload } = action;
      state.isAuthenticating = payload.isAuthenticating;

      //  console.log('newState', state);
    },

    logoutAction: (state, action) => {
      state.user = null;
      state.userData = null;
      state.isAuthenticating = false;
      state.accessToken = null; // Clear the stored token
      state.refershToken = null; // Clear the stored token

      state.isAdmin = false;
      // state.didTryAutoLogin = false;
    },
    setUserData: (state, action) => {
      const { payload } = action;

      state.userData = { ...state.userData, ...payload.userData };
      state.isAuthenticating = false;
      // state.didTryAutoLogin = false;
    },
    setIsAdmin: (state, action) => {
      const { payload } = action;

      state.isAdmin = payload.isAdmin;
      // state.didTryAutoLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticating = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.user = null;
        state.userData = null;
        state.isAuthenticating = false;
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  authenticate,
  logoutAction,
  setUserData,
  setIsAdmin,
  setTokens,
  setIsAuthenticating,
  setIsFetchingUserData,
  setIsRefreshingToken,
} = authSlice.actions;

export default authSlice.reducer;
