import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import Tasks from '../pages/Tasks/Tasks';
import Achievements from '../pages/Achievements/Achievements';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
import Rewards from '../pages/Rewards/Rewards';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />
      <Route path="/achievements" element={<ProtectedRoute element={<Achievements />} />} />
      <Route path="/rewards" element={<ProtectedRoute element={<Rewards />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
    </Routes>
  );
};

export default AppRouter;
