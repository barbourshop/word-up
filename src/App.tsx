import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestView from './GuestView';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<GuestView />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
