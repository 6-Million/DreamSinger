import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirection
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios"; // Import axios

function SignUpPage() {
  const navigate = useNavigate(); // Hook for redirection
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    realname: "",
    gender: "0",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.endsWith("@umass.edu")) {
          setFormErrors((prev) => ({
            ...prev,
            email: "Email must be a UMass address (@umass.edu).",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, email: "" }));
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(value)) {
          setFormErrors((prev) => ({
            ...prev,
            password:
              "Password must be at least 8 characters long, include uppercase, lowercase letters, and numbers.",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, password: "" }));
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            setFormErrors((prev) => ({
              ...prev,
              confirmPassword: "Passwords do not match.",
            }));
          } else {
            setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          setFormErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match.",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Object.values(formErrors).some((x) => x)) {
      try {
        const response = await axios.post("users/signup/", {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          gender: formData.gender,
          realname: formData.realname,
          age: formData.age,
        });
        if (response.status === 200) {
          alert("Registration Successful!");
          navigate("/login"); // Redirect to login page
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.error.message); // Display error message from server
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    } else {
      alert("Please correct the errors before submitting.");
    }
  };

  const canSubmit = () => {
    return (
      Object.values(formData).every((x) => x) &&
      !Object.values(formErrors).some((x) => x)
    );
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
    marginTop: -5,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 3,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 460,
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div className="jacquard-24-regular" style={{ marginTop: -100 }}>
          <span style={{ fontSize: 80, color: "white" }}>Dream Singer</span>
        </div>
      </div>
      <Container component={Paper} elevation={6} style={boxStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
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
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={7}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth variant="filled" required>
                  <InputLabel>Age</InputLabel>
                  <Select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value=""></MenuItem>
                    {[...Array(100).keys()].map((x) => (
                      <MenuItem key={x + 1} value={x + 1}>
                        {x + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="realname"
                  required
                  fullWidth
                  id="realname"
                  label="Real Name"
                  value={formData.realname}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 10, marginBottom: 5 }}
              disabled={!canSubmit()} // Ensure the button is disabled if not all conditions are met
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default SignUpPage;
