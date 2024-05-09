//用户相关的状态管理

import { createSlice } from "@reduxjs/toolkit";
import { request, setToken as _setToken, getToken } from "../../utils";
import { Navigate } from "react-router-dom";

const userStore = createSlice({
  name: "user",
  initialState: {
    //初始化时候先从localStorage看看有没有token
    token: getToken() || "",
    userInfo: {},
  },
  //同步修改方法
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

//解构actionCreator
const { setToken, setUserInfo } = userStore.actions;
//导出reducer
const userReducer = userStore.reducer;

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    try {
      const res = await request.post("/users/login/", loginForm); //访问后端请求
      console.log("API Response:", res); // 查看API返回的数据
      if (res && res.data.access_token) {
        dispatch(setToken(res.data.access_token)); // 正确地访问 access_token
        return res.data.access_token;
      } else {
        alert("Email or Password is incorrect!");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };
};

//获取用户信息异步方法
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

// 更新用户信息的异步方法
const updateUserInfo = (userInfo) => {
  return async (dispatch) => {
    try {
      const res = await request.put("/users/", userInfo);
      console.log("Update User Info Response:", res);
      if (res && res.data) {
        dispatch(setUserInfo(res.data)); // 假设后端返回更新后的用户信息
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
