import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Navbar from "../Components/Navbar";

const songs = [
    { id: 1, name: "Song One", model: "Model A" },
    { id: 2, name: "Song Two", model: "Model B" },
   
];

function Songs() {
    const [openView, setOpenView] = useState(false);
    const [openRename, setOpenRename] = useState(false);
    const [currentSong, setCurrentSong] = useState({});

    const handleOpenView = (song) => {
        setCurrentSong(song);
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };

    const handleOpenRename = (song) => {
        setCurrentSong(song);
        setOpenRename(true);
    };

    const handleCloseRename = () => {
        setOpenRename(false);
    };

    const handleDelete = (songId) => {
       
        console.log("Deleted song with ID:", songId);
    };

    return (
        <div>
            <Navbar style={{marginTop:-10}} />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Song ID</TableCell>
                            <TableCell>Song Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {songs.map((song) => (
                            <TableRow key={song.id}>
                                <TableCell>{song.id}</TableCell>
                                <TableCell>{song.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenView(song)}>View</Button>
                                    <Button onClick={() => handleOpenRename(song)}>Rename</Button>
                                    <Button onClick={() => handleDelete(song.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* View Dialog */}
                <Dialog open={openView} onClose={handleCloseView}>
                    <DialogTitle>View Song</DialogTitle>
                    <DialogContent>
                        <div>Name: {currentSong.name}</div>
                        <div>Model: {currentSong.model}</div>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseView}>Close</Button>
                    </DialogActions>
                </Dialog>

               
                <Dialog open={openRename} onClose={handleCloseRename}>
                    <DialogTitle>Rename Song</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Song Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={currentSong.name}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRename}>Cancel</Button>
                        <Button onClick={handleCloseRename}>Save</Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
        </div>
    );
}

export default Songs;
