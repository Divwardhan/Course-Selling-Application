import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { styled } from '@mui/system';

import { Container ,Box, CardContent, CardMedia, CircularProgress, Grid, Typography ,Card} from '@mui/material'
import { useNavigate } from 'react-router-dom';
const UserCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const StyledCard = styled(Card)({
    maxWidth: 345,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
  });

  async function getCourses() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/user/purchases',
        {
          headers: {
            token: token,
          },
        }
      );
      setCourses(response.data.courses);
      // console.log(response.data.message);
    } catch (error) {
      if (error.response) {
        console.error('Error fetching courses:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  
  function handleClick(course) {
    setLoading(true);
    navigate(`/purchases/${course.title}`);
    console.log(course);
  }

  useEffect(() => {
      getCourses();
    }, []);
  
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Courses
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard onClick={function() { handleClick(course) }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.imageUrl || 'https://via.placeholder.com/150'}
                  alt={course.title || 'Course Image'}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {course.title} - {course.price}/-
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'none', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', padding: '10px', borderRadius: '5px' }}
                    className="course-description"
                  >
                    {course.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default UserCourses
