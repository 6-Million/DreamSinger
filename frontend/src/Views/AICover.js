import React, {useEffect, useState} from "react";
import {
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";
import Navbar from "../Components/Navbar";

const models = [
  { id: 0, name: "Michael Jackson", imgUrl: 'url("/mj.jpg")' },
  { id: 1, name: "Ariana Grande", imgUrl: 'url("/ag.jpg")' },
  { id: 2, name: "Freddie Mercury", imgUrl: 'url("/fm.jpg")' },
  { id: 3, name: "Taylor Swift", imgUrl: 'url("/ts.jpg")' },
  { id: 4, name: "Kurt Cobain", imgUrl: 'url("/kc.jpg")' },
  { id: 5, name: "Adele", imgUrl: 'url("/ad.jpg")' },
];

const initialFormData = {
  model: 0,
  youtubelink: "",
  file: null,
  filename: "",
  // outputfile: "/rolling_ag.mp3",
  outputfile: "/hey_jude_mj.mp3",
  //   outputfile: "",
  imgUrl: "",
};

function AiCover() {
  const [formData, setFormData] = useState(initialFormData);
    // const [outputFile, setOutputFile] = useState("");
  // const [outputFile, setOutputFile] = useState("/rolling_ag.mp3");
  const [outputFile, setOutputFile] = useState("/hey_jude_mj.mp3");
  const [hoverBgImage, setHoverBgImage] = useState('url("/mj.jpg")');

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (showLoading) {
      setTimer(0);
      const intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);

      // 清理定时器
      return () => clearInterval(intervalId);
    }
  }, [showLoading]);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 获取文件对象
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        file: file,
        filename: file.name, // 保存文件名
      }));
    }
    console.log("File:", file.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoading(true);

    const url = "https://your-api-url.com/api/upload"; // API
    const data = new FormData();
    data.append("model", formData.model);
    data.append("path", formData.outputfile);
    if (formData.file) {
      data.append("file", formData.file);
    } else {
      data.append("youtubelink", formData.youtubelink);
    }

    // try {
    //     const response = await axios.post(url, data, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     });
    //     setOutputFile(response.data.outputfile);
    // } catch (error) {
    //     console.error('Error submitting form:', error);
    // }
    data.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  };

  const handleClear = () => {
    setFormData({
      ...initialFormData, // 使用扩展运算符来复制初始表单数据
      file: null, // 明确将 file 设置为 null
    });
    setOutputFile("");
    setShowLoading(false);
  };

  const backgroundStyle = {
    height: "100vh",
    backgroundImage: hoverBgImage,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-image 0.5s ease-in-out",
  };

  const boxStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  };

  return (
    <div style={backgroundStyle}>
      <Navbar/>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div className="jacquard-24-regular" style={{ marginTop: 30 }}>
          <span style={{ fontSize: 100, color: "blue" }}>Cover Song</span>
        </div>
      </div>
      <Container style={{
            ...boxStyle,
            marginBottom: outputFile ? '57px' : showLoading ? '90px' : '130px'  // 当outputFile存在时底部边距更大
          }}
        sx={{
          mt: 3,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: 1,
          borderColor: "grey.300",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
          bgcolor: "background.paper",
          width: "34%",
        }}
      >
        <Box sx={{ width: "95%", mt: 1, ml: 3 }}>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Choose Voice:</FormLabel>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                mt: 2,
                transition: "background 0.3s ease",
              }}
            >
              {models.map((mod) => (
                <Button
                  key={mod.id}
                  variant={formData.model === mod.id ? "contained" : "outlined"}
                  onClick={() => handleChange("model", mod.id)}
                  onMouseEnter={() => setHoverBgImage(mod.imgUrl)}
                  onMouseLeave={() =>
                    setHoverBgImage(
                      models.find((model) => model.id === formData.model).imgUrl
                    )
                  }
                  sx={{
                    width: 120,
                    height: 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle1">{mod.name}</Typography>
                </Button>
              ))}
            </Box>
          </FormControl>
          <FormLabel component="legend" style={{ marginTop: 10 }} sx={{ fontWeight: 'bold' }}>
            YouTube Link for your song:
          </FormLabel>
          <TextField
            fullWidth
            name="youtubelink"
            value={formData.youtubelink}
            onChange={(event) =>
              handleChange(event.target.name, event.target.value)
            }
            margin="normal"
            variant="outlined"
            sx={{ width: "80%" }}
          />
          <FormLabel component="legend" style={{ marginTop: 10 }} sx={{ fontWeight: 'bold' }}>
            or upload song file instead:
          </FormLabel>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
            <Button variant="contained" component="label" sx={{ mt: 1, mb: 1 }}>
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {formData.filename && (
              <Typography variant="subtitle1" sx={{ mt: 1, ml: 2 }}>
                Uploaded File: {formData.filename}
              </Typography>
            )}
          </Box>
          <Box>
            {outputFile ? (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="overline" sx={{ fontWeight: 'bold' }}>Output File:</Typography>
                  </Box>
                  <Box>
                    <ReactAudioPlayer src={outputFile} controls />
                    <Button variant="contained" color="primary" href={outputFile} style={{ marginLeft: 40, marginTop: -25 }} download>
                      Download
                    </Button>
                  </Box>
                </Box>
            ) : showLoading && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading... ({timer} seconds)</Typography>
                </Box>
            )}
          </Box>
          <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2, mr: 25 }}
          >
            Generate
          </Button>
          <Button variant="outlined" onClick={handleClear} sx={{ mt: 2 }}>
            Clear
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default AiCover;
