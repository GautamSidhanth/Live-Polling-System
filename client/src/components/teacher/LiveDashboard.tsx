import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../utils/api';
import { Poll } from '../../types';
import ChatWidget from '../shared/ChatWidget';
import styles from './LiveDashboard.module.css';

const LiveDashboard = () => {
  const { socket } = useSocket();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const currentPoll = await api.getCurrentPoll();
        setPoll(currentPoll);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPoll();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('vote:update', (updatedPoll: Poll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off('vote:update');
    };
  }, [socket]);

  if (!poll) return <div className={styles.container}>Loading active poll...</div>;

  const totalVotes = poll.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Question</h1>
        <button className={styles.historyBtn} onClick={() => window.location.href = '/teacher/history'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Poll history
        </button>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.questionSection}>
          <div className={styles.questionCard}>
            {poll.question}
          </div>
          
          <div className={styles.optionsList}>
            {poll.options.map((option: any, index: number) => {
              const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
              return (
                <div key={option.id} className={styles.optionRow}>
                  <div 
                    className={styles.resultBar} 
                    style={{ width: `${percentage}%` }}
                  />
                  
                  <div className={styles.optionContent}>
                     <div className={styles.optionLeft}>
                        <div className={styles.indexCircle}>
                            {index + 1}
                        </div>
                        <span className={styles.optionText}>{option.text}</span>
                     </div>
                     <span className={styles.voteCount}>
                        {percentage}%
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className={styles.askNewBtn} onClick={() => window.location.href = '/teacher'}>
        <span style={{ marginRight: '8px' }}>+</span> Ask a new question
      </button>

      <ChatWidget />
    </div>
  );
};

export default LiveDashboard;
