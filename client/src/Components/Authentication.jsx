import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Topbar from './Topbar';
import { 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  TextField, 
  Button, 
} from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const StyledGrid = styled(Grid)`
  border-radius: 10px; 
  border: 1px solid #ccc; 
  padding: 20px; 
  background-color: #f0f0f0;
  position: relative;
  bottom: 5%;
`;

const Authentication = () => {
  const [alignment, setAlignment] = useState('Register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleUser = function() {
    alignment === 'Register' ? registerUser() : signinUser();
  };

  const registerUser = async function() {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const signinUser = async  function() {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/signin', {
        email,
        password,
      });

      // Save token and set authenticated status
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  // Redirect to "/" if the user is authenticated
  if (isAuthenticated || localStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Topbar />
      <Grid 
        container 
        justifyContent="center" 
        alignItems="center" 
        sx={{ height: '100vh', backgroundColor: 'black' }}
      >
        <StyledGrid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          textAlign={'center'}
        >
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="Register">Register</ToggleButton>
            <ToggleButton value="Signin">Signin</ToggleButton>
          </ToggleButtonGroup>

          {alignment === 'Register' && (
            <>
              <Typography variant="h6" gutterBottom>
                Registration
              </Typography>
              <TextField 
                label="First Name" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
              <TextField 
                label="Last Name" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
              />
            </>
          )}

          {alignment === 'Signin' && (
            <Typography variant="h6" gutterBottom>
              Signin
            </Typography>
          )}

          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button variant="contained" color="primary" onClick={handleUser} fullWidth>
            {alignment === 'Register' ? 'Register' : 'Signin'}
          </Button>
        </StyledGrid>
      </Grid>
    </>
  );
};

export default Authentication;
