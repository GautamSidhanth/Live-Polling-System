import { SocketProvider } from './context/SocketContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './index.css';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/teacher/*" element={<TeacherDashboard />} />
          <Route path="/student/*" element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
