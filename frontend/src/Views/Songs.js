import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Pagination,
} from '@mui/material';
import Navbar from "../Components/Navbar";
import {request} from "../utils";
import ReactAudioPlayer from "react-audio-player";

const init_songs = [
    { id: 1, name: "rolling_ag.mp3", model: "Ariana Grande", src: "http://localhost:8000/cover/rolling_ag.mp3", download: "http://localhost:8000/api/v1/download/cover/rolling_ag.mp3" },
    { id: 2, name: "yt_11.mp3", model: "Michael Jackson", src: "http://localhost:8000/cover/heyjude_mj.mp3", download: "http://localhost:8000/api/v1/download/cover/heyjude_mj.mp3" },
];
const modelMap = {
    0: "Michael Jackson",
    1: "Ariana Grande",
    2: "Freddie Mercury",
    3: "Taylor Swift",
    4: "Kurt Cobain",
    5: "Adele",
};

function Songs() {
    const [songs, setSongs] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [openRename, setOpenRename] = useState(false);
    const [currentSong, setCurrentSong] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [newSongName, setNewSongName] = useState('');
    const songsPerPage = 10;
    const totalPageCount = 10;

    useEffect(() => {
        fetchSongs(currentPage, songsPerPage);
    }, [currentPage]);

    const fetchSongs = (page, num) => {
        request.get(`/songs/`, { params: { page, num } })
            .then(response => {
                // 假设后端返回的数据结构是 { data: [] }
                setSongs(response);
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
                setSongs([]);  // 发生错误或当前页没有数据时设置为空数组
            });
    };

    const handleOpenView = (song) => {
        setCurrentSong(song);
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };

    const handleOpenRename = (song) => {
        setCurrentSong(song);
        setNewSongName(song.name)
        setOpenRename(true);
    };

    const handleInputChange = (event) => {
        setNewSongName(event.target.value);
    };

    const handleSaveRename = async () => {
        /// 创建新歌曲列表，用新名称更新选定歌曲
        const updatedSongs = songs.map((song) => {
            if (song.id === currentSong.id) {
                return { ...song, name: newSongName };
            }
            return song;
        });
        setSongs(updatedSongs); // 更新歌曲列表
        setOpenRename(false); // 关闭重命名对话框

        try {
            // 然后从服务器删除歌曲
            const data = {
                name: newSongName
            };
            const response = await request.put("/songs/file/" + currentSong.id + "/", data);
            // console.log(response);
            alert(response.message);
        } catch (error) {
            // console.log(error.message)
            alert(error.message)
        }
    };

    const handleCloseRename = () => {
        setOpenRename(false);
    };

    const handleDelete = async (songId) => {
        // 先从本地状态中删除歌曲
        const updatedSongs = songs.filter(song => song.id !== songId);
        setSongs(updatedSongs);

        try {
            // 然后从服务器删除歌曲
            const response = await request.delete("/songs/file/" + songId + "/");
            alert(response.message);
            // console.log(response);
        } catch (error) {
            alert(error.message)
            // console.log(error.message)
        }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <Navbar style={{marginTop:-10}} />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Song ID</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Song Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Voice</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Operations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {songs.map((song) => (
                            <TableRow key={song.id}>
                                <TableCell>{song.id}</TableCell>
                                <TableCell>{song.name}</TableCell>
                                <TableCell>{modelMap[song.model] || 'Unknown artist'}</TableCell>
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
                        <div style={{ fontWeight: 'bold' }}>Name: {currentSong.name}</div>
                        <div style={{ fontWeight: 'bold', marginTop: '3%' }}>Voice: {modelMap[currentSong.model] || 'Unknown artist'}</div>
                        <ReactAudioPlayer src={"http://localhost:8000/"+currentSong.file} style={{marginTop: '8%'}} controls />
                        <Button size="small" variant="contained" color="primary" href={"http://localhost:8000/api/v1/download/"+currentSong.file} style={{ marginLeft: 40, marginTop: -25 }} download>
                            Download
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseView} style={{marginTop:"-5%"}}>Close</Button>
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
                            value={newSongName}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRename}>Cancel</Button>
                        <Button onClick={handleSaveRename}>Save</Button>
                    </DialogActions>
                </Dialog>

                <Pagination
                    count={totalPageCount}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                    style={{marginLeft:"38%"}}
                />
            </TableContainer>
        </div>
    );
}

export default Songs;
