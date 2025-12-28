import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
    // Track participants
    const participants = new Map<string, string>(); // socketId -> name

    io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        const name = participants.get(socket.id);
        if (name) {
            participants.delete(socket.id);
            io.emit('participants:update', Array.from(new Set(participants.values())));
            io.emit('chat:receive', {
                id: Date.now().toString(),
                sender: 'System',
                text: `${name} left the session`,
                isOwn: false
            });
        }
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
         io.emit('chat:receive', {
            id: Date.now().toString(),
            sender: 'System',
            text: `${studentName} was kicked from the session`,
            isOwn: false
         });
         
         // Remove from participants
         for (const [id, name] of participants.entries()) {
             if (name === studentName) participants.delete(id);
         }
         io.emit('participants:update', Array.from(new Set(participants.values())));
      });

      socket.on('join', (data: { name: string; role: string }) => {
          if (data.role === 'student') {
            participants.set(socket.id, data.name);
            console.log(`${data.name} joined as ${data.role}`);
            
            // Broadcast new participant list
            io.emit('participants:update', Array.from(new Set(participants.values())));
            
            // System message
            io.emit('chat:receive', {
                id: Date.now().toString(),
                sender: 'System',
                text: `${data.name} joined the session`,
                isOwn: false
            });
          }
      });
    });
};
