import { useState } from 'react';
import { api } from '../../utils/api';
import styles from './CreatePoll.module.css';

interface OptionDraft {
  id: number;
  text: string;
  isCorrect: boolean;
}

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState<OptionDraft[]>([
    { id: 1, text: '', isCorrect: true },
    { id: 2, text: '', isCorrect: false },
  ]);

  const handleAddOption = () => {
    setOptions([...options, { id: options.length + 1, text: '', isCorrect: false }]);
  };

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleCorrectChange = (id: number) => {
    setOptions(options.map(opt => ({ ...opt, isCorrect: opt.id === id })));
  };

  const handleSubmit = async () => {
    try {
      await api.createPoll({
        question,
        duration,
        options: options.filter(o => o.text.trim()) // Filter empty options if any
      });
      // Navigate to live view or let parent handle it
      // For now, reload or switch logic needed.
      // Ideally, pass a callback or use navigate
      window.location.href = '/teacher/live'; // Temporary force reload to switch view
    } catch (error) {
      console.error('Failed to create poll', error);
      alert('Failed to create poll. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBlock}>
        <div className={styles.headerBadge}>
          <span style={{ marginRight: '6px' }}>✨</span> Intervue Poll
        </div>
        <h1 className={styles.title}>Let's Get Started</h1>
        <p className={styles.subtitle}>
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>
      </div>

      <div className={styles.questionSection}>
        <div className={styles.questionHeaderRow}>
            <label className={styles.inputLabel}>Enter your question</label>
            <div className={styles.durationSelectWrapper}>
                <select 
                className={styles.timerSelect} 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>2 minutes</option>
                </select>
            </div>
        </div>
        
        <div className={styles.questionInputContainer}>
            <textarea 
            className={styles.textArea}
            placeholder="Rahul Bajaj" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={100}
            />
            <div className={styles.charCount}>{question.length}/100</div>
        </div>
      </div>

      <div className={styles.optionsHeader}>
        <div className={styles.optionsLabel}>Edit Options</div>
        <div className={styles.correctLabel}>Is it Correct?</div>
      </div>

      <div className={styles.optionsList}>
        {options.map((option, index) => (
            <div key={option.id} className={styles.optionRow}>
            <div className={styles.optionLeft}>
                <div className={styles.optionNumber}>{index + 1}</div>
                <div className={styles.optionInputContainer}>
                    <input 
                    className={styles.optionInput} 
                    value={option.text}
                    placeholder="Rahul Bajaj"
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    />
                </div>
            </div>
            
            <div className={styles.correctToggle}>
                <label className={styles.radioGroup}>
                    <input 
                        type="radio" 
                        className={styles.radio}
                        checked={option.isCorrect}
                        onChange={() => handleCorrectChange(option.id)}
                        name={`correct_group_${option.id}`} 
                    />
                    Yes
                </label>
                <label className={styles.radioGroup}>
                    <input 
                        type="radio" 
                        className={styles.radio}
                        checked={!option.isCorrect}
                        onChange={() => {}}
                        name={`correct_group_${option.id}`}
                    />
                    No
                </label>
            </div>
            </div>
        ))}
      </div>

      <button className={styles.addOptionBtn} onClick={handleAddOption}>
        + Add More option
      </button>

      <div className={styles.askBtnContainer}>
        <button 
          className={styles.askBtn}
          onClick={handleSubmit}
          disabled={!question || options.some(o => !o.text)}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;
