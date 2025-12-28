
import { Routes, Route } from 'react-router-dom';
import CreatePoll from '../components/teacher/CreatePoll';
import LiveDashboard from '../components/teacher/LiveDashboard';
import PollHistory from '../components/teacher/PollHistory';
import ChatWidget from '../components/shared/ChatWidget';
import styles from './TeacherDashboard.module.css';

const TeacherDashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Intervue Poll</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/teacher/history" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                History
            </a>
            <div className={styles.userInfo}>Teacher</div>
        </div>
      </header>

      <div className={styles.content}>
        <Routes>
           <Route path="/" element={<CreatePoll />} />
           <Route path="/live" element={<LiveDashboard />} />
           <Route path="/history" element={<PollHistory />} />
        </Routes>
      </div>

      <ChatWidget />
    </div>
  );
};

export default TeacherDashboard;
