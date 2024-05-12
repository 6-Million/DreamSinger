import React, { useState } from 'react';
import {AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, Box} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, mt: 0 }} onClick={() => navigate('/')}>
                    <img src="/logo.jpg" alt="Logo" style={{ width: 170, height: 38}} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            mx: 10,
                            px: 3, 
                            py: 1,
                            ml: -1,
                            mt: 1,
                            bgcolor: 'black',
                            color: 'white', 
                            borderRadius: '10px',
                            boxShadow: 3, 
                            '&:hover': {
                                bgcolor: 'black', 
                                transform: 'scale(1.1)', 
                                transition: 'all 0.3s ease-in-out' 
                            },
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Cover Song
                    </Box>
                    <Box
                        sx={{
                            mx: 10,
                            px: 3,
                            py: 1,
                            mt: 1,
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: '10px',
                            boxShadow: 3,
                            '&:hover': {
                                bgcolor: 'black',
                                transform: 'scale(1.1)',
                                transition: 'all 0.3s ease-in-out'
                            },
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => navigate('/songs')}
                    >
                        My Songs
                    </Box>
                    <Box
                        sx={{
                            mx: 10,
                            px: 3,
                            py: 1,
                            mt: 1,
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: '10px',
                            boxShadow: 3,
                            '&:hover': {
                                bgcolor: 'black',
                                transform: 'scale(1.1)',
                                transition: 'all 0.3s ease-in-out'
                            },
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => navigate('/profile')}
                    >
                        Profile
                    </Box>
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onMouseEnter={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle style={{ fontSize: 40 }} />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        MenuListProps={{
                            onMouseLeave: handleClose,
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Log out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
