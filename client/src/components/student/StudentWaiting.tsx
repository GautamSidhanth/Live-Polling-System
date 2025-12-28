import React from 'react';
import ChatWidget from '../shared/ChatWidget';
import styles from './StudentWaiting.module.css';

interface StudentWaitingProps {
  studentName: string;
}

const StudentWaiting: React.FC<StudentWaitingProps> = ({ studentName }) => {
  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <span style={{ marginRight: '8px' }}>✨</span> Intervue Poll
      </div>
      
      <div className={styles.loader}></div>
      
      <h2 className={styles.message}>Wait for the teacher to ask questions..</h2>
      
      <ChatWidget 
        userRole="student" 
        userName={studentName} 
      />
    </div>
  );
};

export default StudentWaiting;
