import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from '@/auth/RequireAuth'; 

import Auth from '@/pages/Auth';

import DashboardStudent from '@/pages/Dashboards/DashboardStudent';
import DashboardTeacher from '@/pages/Dashboards/DashboardTeacher';
import DashboardAdmin from '@/pages/Dashboards/DashboardAdmin';

import UserManagement from '@/pages/Management/UsersManagement';
import QuizzesManagement from '@/pages/Management/QuizzesManagement';

import UserCreate from '@/pages/Users/UsersCreate';
import QuizCreate from '@/pages/Quizzes/QuizzesCreate';

import QuizEdit from '@/pages/Quizzes/QuizEdit';
import RedirectIfAuth from '@/auth/RedirectIfAuth';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <RedirectIfAuth>
            <Auth/>
          </RedirectIfAuth>
          } />

        <Route path='/dashboard_student' element={
          <RequireAuth allowedRoles={["student"]}>
            <DashboardStudent />
          </RequireAuth>
          } />
        <Route path='/dashboard_teacher' element={
          <RequireAuth allowedRoles={["teacher"]}>
            <DashboardTeacher />
          </RequireAuth>
          } />
        <Route path='/dashboard_admin' element={
          <RequireAuth allowedRoles={["admin"]}>
            <DashboardAdmin />
          </RequireAuth>
          } />

        <Route path='/dashboard_admin/users' element={
          <RequireAuth allowedRoles={["admin"]}>
            <UserManagement />
          </RequireAuth>
          } />
        <Route path='/dashboard_admin/users/create' element={
          <RequireAuth allowedRoles={["admin"]}>
            <UserCreate />
          </RequireAuth>
          } />

        <Route path="/dashboard_teacher/quizzes" element={
          <RequireAuth allowedRoles={["teacher"]}>
            <QuizzesManagement />
          </RequireAuth>
          } />
        <Route path='/dashboard_teacher/quizzes/create' element={
          <RequireAuth allowedRoles={["teacher"]}>
            <QuizCreate />
          </RequireAuth>
          } />
        <Route path='/dashboard_teacher/quizzes/:id/edit' element={
          <RequireAuth allowedRoles={["teacher"]}>
            <QuizEdit />
          </RequireAuth>
          } />

        
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
