import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
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
    });

    socket.on('join', (data: { name: string; role: string }) => {
        console.log(`${data.name} joined as ${data.role}`);
    });
  });
};
