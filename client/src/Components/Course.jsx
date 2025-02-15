import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, CircularProgress, Paper, Divider, Chip } from '@mui/material';
import { styled } from '@mui/system';
import Topbar from './Topbar';

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '100px 20px 20px', // Added padding for Topbar space
  backgroundColor: '#f0f2f5',
});

const ContentBox = styled(Paper)({
  padding: '30px',
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: '#fff',
  maxWidth: '700px',
  width: '100%',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const CourseImage = styled('img')({
  width: '100%',
  maxHeight: '300px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '20px',
});

const CustomButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#ff4081',
  color: '#fff',
  padding: '12px 25px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: '0.3s ease',
  '&:hover': { backgroundColor: '#e60073' },
});

const DetailText = styled(Typography)({
  color: '#555',
  fontSize: '1rem',
  marginBottom: '8px',
});

const Course = () => {
  const { id } = useParams();
  const title = decodeURIComponent(id);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/course/fetch`, { title });
        setCourse(response.data.course);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [title]);

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/course/purchase',
        { courseId: course._id },
        { headers: { token } }
      );
      alert(response.data.message);
      navigate('/purchases');
    } catch (err) {
      console.error('Error during purchase:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'An error occurred during the purchase process.');
    }
  };

  if (loading)
    return (
      <StyledContainer>
        <Topbar />
        <CircularProgress size={60} />
      </StyledContainer>
    );

  if (error)
    return (
      <StyledContainer>
        <Topbar />
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </StyledContainer>
    );

  if (!course)
    return (
      <StyledContainer>
        <Topbar />
        <Typography variant="h5">Course not found</Typography>
      </StyledContainer>
    );

  return (
    <StyledContainer>
      <Topbar />
      <ContentBox elevation={6}>
        <CourseImage src={course.imageUrl || 'https://via.placeholder.com/700x300'} alt={course.title} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 1 }}>
          {course.title}
        </Typography>
        <DetailText>{course.description}</DetailText>

        <Divider sx={{ width: '100%', marginY: 2 }} />

        {/* Extra Course Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Chip label={`Instructor: ${course.instructor || 'Unknown'}`} variant="outlined" sx={{ marginBottom: 1 }} />
          <Chip label={`Duration: ${course.duration || 'N/A'}`} variant="outlined" sx={{ marginBottom: 1 }} />
          <Chip label={`Level: ${course.level || 'Beginner'}`} variant="outlined" sx={{ marginBottom: 2 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000', marginBottom: 3 }}>
          Price: ₹{course.price}/-
        </Typography>

        <CustomButton onClick={handlePurchase}>Book Now</CustomButton>
      </ContentBox>
    </StyledContainer>
  );
};

export default Course;
