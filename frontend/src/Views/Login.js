import React, {useEffect, useState} from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../store/modules/user";

function LogInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    errors: { email: "", password: "" }, // 添加用于跟踪错误的字段
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      console.log("Token updated:", token);
      navigate("/");
      // alert("Login succeed!")
    }
  }, [token, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let errors = formData.errors;

    switch (name) {
      case "email":
        errors.email = value.includes("@umass.edu")
            ? ""
            : 'Email should contain an "@umass.edu"';
        break;
      case "password":
        errors.password =
            value.length < 8 ? "Password must be at least 8 characters long" : "";
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: value,
      errors,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.errors.email && !formData.errors.password) {
      console.log("Form Data:", formData);
      try {
        const response = await dispatch(
            fetchLogin({
              email: formData.email,
              password: formData.password,
            })
        ); // 使用unwrap来处理Redux Toolkit的异步Thunk

        console.log("Login Response:", response); // 日志输出查看响应内容

        // 假设后端返回的是这种格式 { data: { access_token: 'token_here' } }
        console.log(token)
        console.log("-------")

        if (token !== "") {
          setSnackbarMessage("Login successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true); // 显示Snackbar
          // alert("login success!!")
          navigate("/"); // 登录成功后跳转
        } else {
          setSnackbarMessage("Email or Password is incorrect!");
          setSnackbarSeverity("error");
          setOpenSnackbar(true); // 显示Snackbar
        }

      } catch (error) {
        console.error("Login Error:", error);
        setSnackbarMessage("An unexpected error occurred");
        setSnackbarSeverity("error");
        setOpenSnackbar(true); // 显示Snackbar
      }
    }
  };

  // CSS
  const backgroundStyle = {
    height: "100vh",
    backgroundImage: 'url("/mj3.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const boxStyle = {
    marginTop: -70,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 3,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 450,
  };

  return (
      <div style={backgroundStyle}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div className="jacquard-24-regular" style={{ marginTop: -220 }}>
            <span style={{ fontSize: 80, color: "white" }}>Dream Singer </span>
          </div>
        </div>
        <Container component={Paper} elevation={6} style={boxStyle}>
          <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
          >
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <form style={{ width: "100%", marginTop: 3 }} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                      autoComplete="username"
                      name="email"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      autoFocus
                      value={formData.email}
                      onChange={handleChange}
                      error={!!formData.errors.email}
                      helperText={formData.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!formData.errors.password}
                      helperText={formData.errors.password}
                  />
                </Grid>
              </Grid>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 10, marginBottom: 5 }}
              >
                Log In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    Do not have an account yet? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
        >
          <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
  );
}

export default LogInPage;