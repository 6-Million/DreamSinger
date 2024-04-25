import React, { useState } from 'react';
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
    RadioGroup, Radio, FormControlLabel, InputLabel, Select, MenuItem
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function SignUpPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        realname: '',
        gender: '0',
        age: '',
        password: '',
        confirmPassword: ''
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
        marginTop: -5,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: 3,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 460
    };

    return (
        <div style={backgroundStyle}>
            <div style={{width: '100%', textAlign: 'center'}}>
                <div className="jacquard-24-regular" style={{marginTop: -100}}>
                    <span style={{fontSize: 80, color: "white"}}>Dream Singer </span>
                </div>
            </div>
            <Container component={Paper} elevation={6} style={boxStyle}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Sign Up
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
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    autoFocus
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={7}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                                        <FormControlLabel value="0" control={<Radio />} label="Male" />
                                        <FormControlLabel value="1" control={<Radio />} label="Female" />
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
                                        <MenuItem value="">
                                        </MenuItem>
                                        {[...Array(100).keys()].map(x => (
                                            <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>
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
                                    autoFocus
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
