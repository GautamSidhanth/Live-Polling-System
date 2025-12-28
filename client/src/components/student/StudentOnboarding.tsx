import React, { useState } from 'react';
import styles from './StudentOnboarding.module.css';

interface StudentOnboardingProps {
  onJoin: (name: string) => void;
}

const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onJoin }) => {
  const [name, setName] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <span style={{ marginRight: '8px' }}>✨</span> Intervue Poll
      </div>
      <h1 className={styles.title}>Let’s <strong>Get Started</strong></h1>
      <p className={styles.subtitle}>
        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
      </p>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Enter your Name</label>
        <input 
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahul Bajaj"
        />
      </div>

      <button 
        className={styles.button} 
        disabled={!name.trim()}
        onClick={() => onJoin(name)}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentOnboarding;
