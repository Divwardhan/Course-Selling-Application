import React, { useState } from 'react';
import Authentication from './Components/Authentication';
import Topbar from './Components/Topbar';
import Courses from './Components/Courses';
import Course from './Components/Course';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import UserCourses from './Components/UserCourses';
import HomePage from './Components/HomePage';
import VideoPlayer from './Components/VideoPlayer';
import PurchaseCourse from './Components/PurchaseCourse';
import './App.css';
import VideoList from './Components/VideoList';
import AdminAuth from './Components/AdminAuth';
import AdminDashboard from './Components/AdminDashboard';

function App() {
  const [auth, setauth] = useState(true);
  const [isAuth, setisAuth] = useState(false)
  return(
    <Router>
    <Routes>
        <Route path="/courses" element={<><Topbar auth={auth} setauth={setauth} isAuth={isAuth} setisAuth={setisAuth} /><Courses/></>} />
        <Route path="/auth" element={<><Authentication isAuth={isAuth} setisAuth={setisAuth} /></>} />
        <Route path="/course/:id" element={<CourseWrapper />} />
        <Route path="/purchases" element={<><Topbar auth={auth} setauth={setauth} isAuth={isAuth} setisAuth={setisAuth} /><UserCourses/></>} />
        <Route path="/purchases/:id" element={<><Topbar auth={auth} setauth={setauth} isAuth={isAuth} setisAuth={setisAuth} /><VideoList/></>} />
        <Route path="/" element={<><HomePage/></>} />
        <Route path="/video" element={<><Topbar auth={auth} setauth={setauth} isAuth={isAuth} setisAuth={setisAuth} /><VideoPlayer/></>} />
        <Route path="/purchases/:id/:video" element={<><Topbar auth={auth} setauth={setauth} isAuth={isAuth} setisAuth={setisAuth} /><VideoPlayer/></>} />
        <Route path="/author/auth" element={<><AdminAuth isAuth={isAuth} setisAuth={setisAuth} /></>} />
        <Route path="/author/dashboard" element={<><AdminDashboard/></>}/>
    </Routes>
    </Router>
  );
}
const CourseWrapper = () => {
  return <><Course /></>;
};

export default App;