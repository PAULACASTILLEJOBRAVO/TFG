import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CourseList from '@/components/Courses/CourseList';
// import CourseDetail from '@/components/Courses/CourseDetails';
import Auth from '@/pages/Auth';
import DashboardStudent from '@/pages/Dashboards/DashboardStudent';
import DashboardTeacher from '@/pages/Dashboards/DashboardTeacher';
import DashboardAdmin from '@/pages/Dashboards/DashboardAdmin';
import UserManagement from '@/pages/Management/UsersManagement';
import QuizzesManagement from '@/pages/Management/QuizzesManagement';
import UserCreate from '@/pages/Users/UsersCreate';
import QuizCreate from '@/pages/Quizzes/QuizzesCreate';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>} />

        <Route path='/dashboard_student' element={<DashboardStudent/>} />
        <Route path='/dashboard_teacher' element={<DashboardTeacher/>} />
        <Route path='/dashboard_admin' element={<DashboardAdmin/>} />

        <Route path='/dashboard_admin/users' element={<UserManagement/>} />
        <Route path='/dashboard_admin/users/create' element={<UserCreate />} />

        <Route path="/dashboard_teacher/quizzes" element={<QuizzesManagement />} />
        <Route path='/dashboard_teacher/quizzes/create' element={<QuizCreate />} />

        {/* <Route path='/courses/:id' element={<CourseDetail/>} /> */}
        
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
