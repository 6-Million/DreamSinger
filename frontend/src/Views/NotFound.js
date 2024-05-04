import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const goHome = () => {
    navigate("/Login"); // This replaces history.push('/')
  };

  return (
    <Container style={styles.container}>
      <Typography variant="h1" style={styles.header}>
        404
      </Typography>
      <Typography variant="h4" style={styles.subHeader}>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" style={styles.description}>
        We can't find the page you're looking for.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={goHome}
        style={styles.button}
      >
        Go Home
      </Button>
    </Container>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    fontSize: "150px",
    fontWeight: "bold",
    color: "#1565c0", // Deep Blue
  },
  subHeader: {
    margin: "20px 0",
  },
  description: {
    marginBottom: "30px",
  },
  button: {
    marginTop: "20px",
  },
};

export default NotFoundPage;
