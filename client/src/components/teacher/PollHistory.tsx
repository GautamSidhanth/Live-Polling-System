import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Poll } from '../../types';
import ChatWidget from '../shared/ChatWidget';
import styles from './PollHistory.module.css';

const PollHistory = () => {
  const [history, setHistory] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getPollHistory();
        if (Array.isArray(data)) {
            setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className={styles.container}>Loading history...</div>;

  return (
    <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
            <h1 className={styles.pageTitle}>
                View <strong>Poll History</strong>
            </h1>

            {history.length === 0 ? (
                <div className={styles.emptyState}>No past polls found.</div>
            ) : (
                <div className={styles.historyList}>
                    {history.map((poll, index) => {
                        const totalVotes = poll.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);
                        return (
                            <div key={poll.id} className={styles.historyItem}>
                                <div className={styles.questionLabel}>Question {index + 1}</div>
                                
                                <div className={styles.pollCard}>
                                    <div className={styles.questionHeader}>
                                        {poll.question}
                                    </div>
                                    <div className={styles.optionsList}>
                                        {poll.options.map((option: any, idx) => {
                                            const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                                            return (
                                                <div key={option.id} className={styles.optionRow}>
                                                    <div className={styles.resultBar} style={{ width: `${percentage}%` }} />
                                                    <div className={styles.optionContent}>
                                                        <div className={styles.optionLeft}>
                                                            <div className={styles.indexCircle}>
                                                                {idx + 1}
                                                            </div>
                                                            <span className={styles.optionText}>{option.text}</span>
                                                        </div>
                                                        <span className={styles.voteCount}>{percentage}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
        <ChatWidget />
    </div>
  );
};

export default PollHistory;
