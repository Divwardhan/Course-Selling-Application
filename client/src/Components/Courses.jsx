import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)({
  maxWidth: 350,
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
  },
});

const StyledCardMedia = styled(CardMedia)({
  height: 180,
});

const StyledCardContent = styled(CardContent)({
  backgroundColor: '#f9f9f9',
  textAlign: 'center',
});

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchCourses() {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/course/preview');
      setCourses(response.data.Course || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  function handleClick(course) {
    navigate(`/course/${course.title}`);
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        Available Courses
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard onClick={() => handleClick(course)}>
                <StyledCardMedia
                  component="img"
                  image={course.imageUrl || 'https://via.placeholder.com/350'}
                  alt={course.title || 'Course Image'}
                />
                <StyledCardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ₹{course.price}/-
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Courses;
