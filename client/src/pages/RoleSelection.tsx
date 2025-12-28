import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoleSelection.module.css';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'teacher') {
      navigate('/teacher');
    } else if (selectedRole === 'student') {
      navigate('/student');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <span style={{ marginRight: '8px' }}>✨</span> 
        Intervue Poll
      </div>
      
      <h1 className={styles.title}>Welcome to the <strong>Live Polling System</strong></h1>
      <p className={styles.subtitle}>
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className={styles.cardContainer}>
        <div 
          className={`${styles.card} ${selectedRole === 'student' ? styles.selected : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <div className={styles.cardTitle}>I'm a Student</div>
          <p className={styles.cardDesc}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </div>

        <div 
          className={`${styles.card} ${selectedRole === 'teacher' ? styles.selected : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <div className={styles.cardTitle}>I'm a Teacher</div>
          <p className={styles.cardDesc}>
            Submit answers and view live poll results in real-time.
          </p>
        </div>
      </div>

      <button 
        className={styles.button}
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;
