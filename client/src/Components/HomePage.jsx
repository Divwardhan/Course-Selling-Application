import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Container } from '@mui/material';
import Lottie from 'lottie-react';

import visualizerAnimation from './visualizer.json'; // Path to your Lottie file
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [isLogin, setisLogin] = useState(false);
    const navigate = useNavigate();
    function authhandler(){
        isLogin?
        function(){
            localStorage.removeItem('token');
            setisLogin(false)
            navigate('/auth')

        }():
        navigate('/auth')
        console.log('clicked')
        
        
    }

    useEffect(function(){
        const token = localStorage.getItem('token');
        token?setisLogin(true):setisLogin(false)
    }, [])
    
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#111',
        color: '#fff',
        backgroundImage: 'linear-gradient(45deg, #111, #222)',
      }}
    >
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#FF6600' }}>
            MyCourseApp
          </Typography>
          <Box>
            <Button color="inherit" sx={{ fontSize: '1rem', marginRight: 2 }} onClick={function(){authhandler()}}>
              {isLogin?'Logout':'Login'}
            </Button>
            {!isLogin&&<Button
              variant="contained"
              color="warning"
              sx={{
                backgroundColor: '#FF6600',
                fontSize: '1rem',
              }}
              onClick={function(){navigate('/auth')}}
            >
              Sign Up
            </Button>}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', marginTop: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Pro Developers Guide
        </Typography>
        <Typography variant="h6" sx={{ color: '#aaa', mb: 4 }}>
          Our well experienced team of developers will guide you through the marvels of Javascript
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          sx={{
            backgroundColor: '#FF6600',
            padding: '12px 32px',
            fontSize: '1.2rem',
            marginRight: 2,
          }}
          onClick={function(){navigate('/courses')}}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="warning"
          size="large"
          sx={{
            borderColor: '#FF6600',
            color: '#FF6600',
            padding: '12px 32px',
            fontSize: '1.2rem',
          }}
        >
          Learn More
        </Button>
      </Container>

      {/* Visualizer Section */}
      <Box sx={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '80%' }}>
          <Lottie
            animationData={visualizerAnimation}
            loop
            style={{ width: '100%', height: '200px' }}
          />
        </Box>
      </Box>

      <Box sx={{ marginTop: 10, padding: 4, textAlign: 'center', borderTop: '1px solid #333' }}>
        <Typography variant="body2" sx={{ color: '#aaa' }}>
          &copy; {new Date().getFullYear()} MyCourseApp. All Rights Reserved.
        </Typography>
        <Button onClick={() => {localStorage.removeItem('token');navigate('/author/auth')}}>Become an Author</Button>
        <Button onClick={() => {localStorage.removeItem('token');navigate('/author/auth')}}>Author Signin</Button>
        
      </Box>
    </Box>
  );
};

export default HomePage;
