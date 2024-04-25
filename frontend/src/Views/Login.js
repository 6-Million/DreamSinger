import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Link, Paper } from '@mui/material';
import {Link as RouterLink} from "react-router-dom";
import '../App.css';

function LogInPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Data:', formData);
        alert('Check console for form data');
    };

    // CSS
    const backgroundStyle = {
        height: '100vh',
        backgroundImage: 'url("/mj3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const boxStyle = {
        marginTop: -70,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: 3,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 450
    };

    return (
        <div style={backgroundStyle}>
            <div style={{width: '100%', textAlign: 'center'}}>
                <div className="jacquard-24-regular" style={{marginTop: -220}}>
                    <span style={{fontSize: 80, color: "white"}}>Dream Singer </span>
                </div>
            </div>
            <Container component={Paper} elevation={6} style={boxStyle}>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Log In
                    </Typography>
                    <form style={{ width: '100%', marginTop: 3 }} onSubmit={handleSubmit}>
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
        </div>
    );
}

export default LogInPage;
