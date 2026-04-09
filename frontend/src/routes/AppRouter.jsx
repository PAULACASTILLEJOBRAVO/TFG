import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from '@/pages/Auth';

import RequireAuth from '@/auth/RequireAuth'; 
import RedirectIfAuth from '@/auth/RedirectIfAuth';

import NotFound from '@/pages/Errors/NotFound';

import {
  DashboardStudent,
  DashboardTeacher,
  DashboardAdmin
} from '@/pages/Dashboards';

import {
  UserManagement, 
  QuizzesManagement,
  ClickersManagement
} from '@/pages/Management';

import UserCreate from '@/pages/Users/UsersCreate';
import QuizCreate from '@/pages/Quizzes/QuizCreate';

import QuizEdit from '@/pages/Quizzes/QuizEdit';

import { 
  SessionControl,
  SessionPresentation
} from '@/pages/Sessions';

import {
  QuizzesHistory,
  SessionHistory
} from '@/pages/Histories';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <RedirectIfAuth>
            <Auth/>
          </RedirectIfAuth>
          } />

        // DASHBOARDS
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

        // ADMIN PAGES
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
        <Route path='/dashboard_admin/clickers' element={
          <RequireAuth allowedRoles={["admin"]}>
            <ClickersManagement />
          </RequireAuth>
          } />

        // TEACHER PAGES
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
        <Route path='/dashboard_teacher/session/:id' element={
          <RequireAuth allowedRoles={["teacher"]}>
            <SessionControl />
          </RequireAuth>
          } />
        <Route path='/dashboard_teacher/session/:id/presentation' element={
          <RequireAuth allowedRoles={["teacher"]}>
            <SessionPresentation />
          </RequireAuth>
          } />

        // STUDENT PAGES
        <Route path='/dashboard_student/quizzes' element={
          <RequireAuth allowedRoles={["student"]}>
            <QuizzesHistory />
          </RequireAuth>
          } /> 
        <Route path='/dashboard_student/quizzes/:id/history' element={
          <RequireAuth allowedRoles={["student"]}>
            <SessionHistory />
          </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
