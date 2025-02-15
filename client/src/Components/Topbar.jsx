import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Popper,
  Paper,
  ClickAwayListener,
  Drawer,
  Divider,
  Box,
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.35),
  },
  marginLeft: theme.spacing(2),
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '4px 10px',
  border: '1px solid rgba(255,255,255,0.3)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: 'rgba(255,255,255,0.8)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    transition: theme.transitions.create('width'),
    width: '15ch',
    '&:focus': {
      width: '20ch',
    },
  },
}));

export default function Topbar({ auth, setauth }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const debouncedSearch = debounce(async (term) => {
    if (term.trim()) {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/course/preview');
        const courses = response.data.Course || [];
        const filtered = courses.filter((course) =>
          course.title.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filtered);
        setAnchorEl(term ? document.getElementById('search-input') : null);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setAnchorEl(null);
    }
  }, 500);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleResultClick = (course) => {
    
    navigate(`/course/${course.title}`);
    setSearchTerm('');
    setSearchResults([]);
    setAnchorEl(null);
  };

  const handleClickAway = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#1e1e2f', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <IconButton size="large" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250, p: 2 }}>
              <List>
                <ListItem button component={NavLink} to="/">
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={NavLink} to="/courses">
                  <ListItemText primary="Courses" />
                </ListItem>
                <ListItem button component={NavLink} to="/purchases">
                  <ListItemText primary="Purchases" />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2 }}>
            <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Coursey</NavLink>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              id="search-input"
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ClickAwayListener onClickAway={handleClickAway}>
              <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
                <Paper sx={{ maxHeight: 200, overflowY: 'auto', width: 300, mt: 1, p: 1 }}>
                  <List>
                    {searchResults.map((course) => (
                      <ListItem button key={course._id} onClick={() => handleResultClick(course)}>
                        <ListItemText primary={course.title} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Popper>
            </ClickAwayListener>
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
