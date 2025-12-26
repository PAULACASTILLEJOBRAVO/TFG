import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from '../components/Courses/CourseList';
import CourseDetail from '../components/Courses/CourseDetails';
import Auth from '@/pages/Auth';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>} />

        <Route path="/courses" element={<CourseList />} />
        <Route path='/courses/:id' element={<CourseDetail/>} />
        
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
