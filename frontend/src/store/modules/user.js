//用户相关的状态管理

import { createSlice } from "@reduxjs/toolkit";
import { request, setToken as _setToken, getToken } from "../../utils";

const userStore = createSlice({
  name: "user",
  initialState: {
    //初始化时候先从localStorage看看有没有token
    token: getToken() || "",
  },
  //同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      //在localStorage中存储token
      _setToken(action.payload);
    },
  },
});

//解构actionCreator
const { setToken } = userStore.actions;
//导出reducer
const userReducer = userStore.reducer;

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    try {
      const res = await request.post("/users/login/", loginForm); //访问后端请求
      console.log("API Response:", res); // 查看API返回的数据
      if (res && res.access_token) {
        dispatch(setToken(res.access_token)); // 正确地访问 access_token
      } else {
        console.error("No access token in response");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };
};

export { setToken, fetchLogin };

export default userReducer;
