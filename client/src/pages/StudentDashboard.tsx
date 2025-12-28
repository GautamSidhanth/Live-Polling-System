import { useState, useEffect } from 'react';
import StudentOnboarding from '../components/student/StudentOnboarding';
import StudentWaiting from '../components/student/StudentWaiting';
import StudentPoll from '../components/student/StudentPoll';
import StudentKicked from '../components/student/StudentKicked';

import { useSocket } from '../context/SocketContext';
import { api } from '../utils/api';
import { Poll } from '../types';

const StudentView = () => {
  const [studentName, setStudentName] = useState<string | null>(localStorage.getItem('studentName'));
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [isKicked, setIsKicked] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    // Check initial state
    const fetchPoll = async () => {
      try {
        const poll = await api.getCurrentPoll();
        if (poll && poll.status === 'OPEN') {
          setActivePoll(poll);
        }
      } catch (error) {
        // No active poll is fine
      }
    };
    fetchPoll();
  }, []);

  // Effect to join when socket connects or name changes
  useEffect(() => {
    if (socket && studentName) {
        socket.emit('join', { name: studentName, role: 'student' });
    }
  }, [socket, studentName]);

  useEffect(() => {
    if (!socket) return;

    socket.on('poll:created', (poll: Poll) => {
      setActivePoll(poll);
    });

    socket.on('vote:update', (updatedPoll: Poll) => {
        // If we are looking at the same poll, update it
        setActivePoll(prev => prev && prev.id === updatedPoll.id ? updatedPoll : prev);
    });

    socket.on('student:kicked', (kickedName: string) => {
      if (kickedName === studentName || kickedName === localStorage.getItem('studentName')) {
        setIsKicked(true);
        localStorage.removeItem('studentName'); // Clear session
      }
    });
    
    // Also listen for poll end?
    
    return () => {
      socket.off('poll:created');
      socket.off('vote:update');
      socket.off('student:kicked');
    };
  }, [socket, studentName]);

  const handleJoin = (name: string) => {
    localStorage.setItem('studentName', name);
    setStudentName(name);
    // Join socket room if needed
    // Join socket room if needed
    if (socket) {
      socket.emit('join', { name, role: 'student' });
    }
  };

  if (isKicked) {
    return <StudentKicked />;
  }

  if (!studentName) {
    return <StudentOnboarding onJoin={handleJoin} />;
  }

  if (!activePoll) {
    return (
      <StudentWaiting studentName={studentName} />
    );
  }

  return (
    <>
      <StudentPoll poll={activePoll} studentName={studentName} />
    </>
  );
};

export default StudentView;
