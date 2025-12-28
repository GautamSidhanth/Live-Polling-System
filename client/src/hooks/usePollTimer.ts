import { useState, useEffect } from 'react';
import { Poll } from '../types';

export const usePollTimer = (poll: Poll) => {
  const [timeLeft, setTimeLeft] = useState<number>(poll.duration);

  useEffect(() => {
    if (!poll.createdAt) return;

    const startTime = new Date(poll.createdAt).getTime();
    const durationMs = poll.duration * 1000;
    const expiryTime = startTime + durationMs;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const remainingMs = expiryTime - now;
      return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
    };

    // Initial check
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return { timeLeft, formatTime };
};
