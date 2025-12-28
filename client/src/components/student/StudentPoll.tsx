import React, { useState, useEffect } from 'react';
import styles from './StudentPoll.module.css';
import ChatWidget from '../shared/ChatWidget';
import { Poll } from '../../types';
import { api } from '../../utils/api';
import { usePollTimer } from '../../hooks/usePollTimer';

interface StudentPollProps {
  poll: Poll;
  studentName: string;
}

const StudentPoll: React.FC<StudentPollProps> = ({ poll, studentName }) => {
  const { timeLeft, formatTime } = usePollTimer(poll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if already voted for this poll
    console.log('Poll ID:', poll.id);
    const hasVoted = localStorage.getItem(`voted_${poll.id}`);
    if (hasVoted) {
      setIsSubmitted(true);
    }
  }, [poll.id]);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    try {
      await api.submitVote({
        pollId: poll.id, 
        studentName,
        optionId: selectedOption
      });
      localStorage.setItem(`voted_${poll.id}`, 'true');
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Vote failed or you already voted');
    }
  };

  if (isSubmitted || timeLeft <= 0) {
    const totalVotes = poll.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);
    
    return (
        <div className={styles.container}>
             <div className={styles.header} style={{ marginBottom: '1rem' }}>
                <div className={styles.questionNumber}>Question 1</div> 
                <div className={styles.timer}>
                  <img src="https://img.icons8.com/ios-glyphs/30/fa314a/time-machine.png" className={styles.timerIcon} alt="timer"/>
                  {formatTime(timeLeft)}
                </div>
            </div>
             
             <div className={styles.questionCard}>
                {poll.question}
             </div>

             <div className={styles.optionsContainer}>
              {poll.options.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                
                return (
                  <div key={option.id} className={styles.optionLabel} style={{ 
                      padding: 0, 
                      height: '50px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#F8F8F8',
                      border: 'none',
                      cursor: 'default'
                  }}>
                    {/* The Purple Fill Bar */}
                    <div className={styles.resultFill} style={{ width: `${percentage}%` }} />

                    {/* Content Overlay */}
                    <div className={styles.resultContent}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {/* Index circle */}
                            <div className={styles.optionIndex}>{index + 1}</div>
                            
                            {/* Text Color Logic: White if likely covered by bar, else Dark */}
                            <span className={styles.optionText} style={{ 
                                color: percentage > 30 ? 'white' : '#333',
                                position: 'relative',
                                zIndex: 2
                            }}>{option.text}</span> 
                        </div>
                        <span style={{ 
                            fontWeight: 700, 
                            color: percentage > 90 ? 'white' : '#333', /* Percentage text at right end */
                            position: 'relative',
                            zIndex: 2
                        }}>{percentage}%</span>
                    </div>
                  </div>
                );
              })}
             </div>
             
             <h3 style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.25rem', fontFamily: 'Sora', fontWeight: 600 }}>
                Wait for the teacher to ask a new question.. 
             </h3>
        </div>
     );
  }



  return (
    <div className={styles.container}>
      {/* Header: Question 1 and Timer */}
      <div className={styles.topHeader}>
        <div className={styles.questionNumber}>Question 1</div> 
        <div className={styles.timer}>
          <img src="https://img.icons8.com/ios-glyphs/30/fa314a/time-machine.png" className={styles.timerIcon} alt="timer"/>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className={styles.cardWrapper}>
        {/* Question Text Header */}
        <div className={styles.questionCard}>
            {poll.question}
        </div>

        {/* Options List */}
        <div className={styles.optionsContainer}>
            {poll.options.map((option, index) => (
            <div 
                key={option.id} 
                className={`${styles.optionLabel} ${selectedOption === option.id ? styles.selected : ''}`}
                onClick={() => setSelectedOption(option.id)}
            >
                {/* Index Circle */}
                <div className={styles.optionIndex}>{index + 1}</div>
                <span className={styles.optionText}>{option.text}</span>
            </div>
            ))}
        </div>
      </div>

      <div className={styles.submitBtnContainer}>
        <button 
          className={styles.submitBtn}
          disabled={!selectedOption}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      
      <ChatWidget 
        userRole="student" 
        userName={studentName} 
      />
    </div>
  );
};

export default StudentPoll;
