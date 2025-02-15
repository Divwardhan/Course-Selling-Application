import React from 'react';
import { Box, Typography, Paper, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
// import videoFile from '../VideosFolder/webdev/video.mp4';
const StyledVideo = styled('video')({
  borderRadius: '8px',
  width: '90vw',
  height: '100vh',
  objectFit: 'cover',
  outline: 'none',
  border: 'none',
  position: 'absolute',
  right: '4%',
});

const VideoPlayer = function () {
  const {id , video} = useParams()
  const title = decodeURIComponent(id)
  const videoPath = `/VideosFolder/${title}/${video}`;  
  console.log(video , title,videoPath)
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2, bgcolor: '#eef2f3' }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
        Slug it Out !!
      </Typography>
      <Paper elevation={4} sx={{ maxWidth: '640px', width: '100%' }}>
        <StyledVideo
          width="100%"
          height="360"
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </StyledVideo>
      </Paper>
    </Box>
  );
};

export default VideoPlayer;
