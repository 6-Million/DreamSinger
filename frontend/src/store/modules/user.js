import { createSlice } from "@reduxjs/toolkit";
import { request, setToken as _setToken, getToken } from "../../utils";
import { Navigate } from "react-router-dom";

const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || "",
    userInfo: {},
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      //在localStorage中存储token
      _setToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

const { setToken, setUserInfo } = userStore.actions;
const userReducer = userStore.reducer;

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    try {
      const res = await request.post("/users/login/", loginForm); 
      console.log("API Response:", res);
      if (res && res.data.access_token) {
        dispatch(setToken(res.data.access_token)); 
        return res.data.access_token;
      } else {
        alert("Email or Password is incorrect!");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };
};

const fetchUserInfo = () => {
  return async (dispatch) => {
    try {
      const res = await request.get("/users/");
      console.log("User Info Response:", res);
      dispatch(setUserInfo(res.data));
    } catch (error) {
      console.error("Fetch user info failed:", error);
    }
  };
};

const updateUserInfo = (userInfo) => {
  return async (dispatch) => {
    try {
      const res = await request.put("/users/", userInfo);
      console.log("Update User Info Response:", res);
      if (res && res.data) {
        dispatch(setUserInfo(res.data)); 
        alert("User info updated successfully!");
        return res.data;
      }
    } catch (error) {
      console.error("Update user info failed:", error);
      alert("Failed to update user info!");
    }
  };
};

export { setToken, fetchLogin, fetchUserInfo, updateUserInfo };

export default userReducer;
