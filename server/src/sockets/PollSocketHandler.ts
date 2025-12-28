import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  // Store participants in memory (Name -> SocketID or just a Set of names)
  // Using a Map<SocketId, Name> allows handling disconnects correctly
  const participants = new Map<string, string>();

  const broadcastParticipants = () => {
    io.emit('participants:update', Array.from(new Set(participants.values())));
  };

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        broadcastParticipants();
      }
    });
    
    // Chat Events
    socket.on('chat:send', (payload: { sender: string; text: string }) => {
      io.emit('chat:receive', {
        id: Date.now().toString(),
        sender: payload.sender,
        text: payload.text,
        timestamp: new Date().toISOString()
      });
    });

    // Kick Event
    socket.on('student:kick', (studentName: string) => {
       io.emit('student:kicked', studentName);
       // Remove from participants list
       for (const [id, name] of participants.entries()) {
         if (name === studentName) {
           participants.delete(id);
           // Optionally disconnect socket or let client handle it
         }
       }
       broadcastParticipants();
    });

    socket.on('join', (data: { name: string; role: string }) => {
        console.log(`${data.name} joined as ${data.role}`);
        if (data.role === 'student') {
            participants.set(socket.id, data.name);
            broadcastParticipants();
        }
    });

    // Handle re-join or initial check
    socket.on('request:participants', () => {
        socket.emit('participants:update', Array.from(new Set(participants.values())));
    });
  });
};
