import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const API_BASE_URL = "http://localhost:3000/api/v1/admin";
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    token: token,
    "Content-Type": "application/json",
  },
});

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    videos: [""],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axiosInstance.get("/course/bulk");
      setCourses(data?.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpen = (course = null) => {
    setEditingCourse(course);
    setFormData(
      course
        ? {
            title: course.title,
            description: course.description,
            imageUrl: course.imageUrl,
            price: course.price,
            videos: course.videos || [""],
          }
        : { title: "", description: "", imageUrl: "", price: "", videos: [""] }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = value;
    setFormData({ ...formData, videos: updatedVideos });
  };

  const addVideoField = () => {
    setFormData({ ...formData, videos: [...formData.videos, ""] });
  };

  const removeVideoField = (index) => {
    const updatedVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: updatedVideos });
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description || !formData.imageUrl || !formData.price) {
        alert("All fields are required.");
        return;
      }

      let response;
      if (editingCourse) {
        response = await axiosInstance.put("/course", {
          ...formData,
          courseId: editingCourse._id,
        });
      } else {
        response = await axiosInstance.post("/course", formData);
      }

      fetchCourses();
      alert(response.data.message);
      handleClose();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await axiosInstance.delete("/course", {
        data: { courseId: id },
      });

      alert(response.data.message);
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" fontWeight="bold">
          Course Dashboard
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Course
        </Button>
      </div>

      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title || "Course Image"}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <Typography variant="h6" fontWeight="bold">
                    {course.title || "Untitled Course"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {course.description || "No description available."}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{course.price || "N/A"}
                  </Typography>
                  {course.videos && (
                    <Typography variant="body2">
                      Videos: {course.videos.length}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={() => handleOpen(course)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(course._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" align="center" sx={{ width: "100%" }}>
            No courses available.
          </Typography>
        )}
      </Grid>

      {/* Course Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField name="title" value={formData.title} onChange={handleChange} label="Title" fullWidth />
          <TextField name="description" value={formData.description} onChange={handleChange} label="Description" fullWidth />
          <TextField name="imageUrl" value={formData.imageUrl} onChange={handleChange} label="Image URL" fullWidth />
          <TextField name="price" type="number" value={formData.price} onChange={handleChange} label="Price" fullWidth />

          <Typography variant="body1" fontWeight="bold">Videos</Typography>
          {formData.videos.map((video, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <TextField
                value={video}
                onChange={(e) => handleVideoChange(index, e.target.value)}
                placeholder={`Video ${index + 1}`}
                fullWidth
              />
              {formData.videos.length > 1 && (
                <Button variant="contained" color="error" onClick={() => removeVideoField(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="outlined" onClick={addVideoField}>
            Add Video
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
