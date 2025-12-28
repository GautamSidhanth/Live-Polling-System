import React from 'react';
import styles from './StudentKicked.module.css';

const StudentKicked: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.pill}>
        <span style={{ fontSize: '1.2em' }}>✨</span> Intervue Poll
      </div>
      
      <h1 className={styles.title}>You’ve been Kicked out !</h1>
      
      <p className={styles.subtitle}>
        Looks like the teacher had removed you from the poll system. Please<br/>
        Try again sometime.
      </p>
    </div>
  );
};

export default StudentKicked;
