import { io } from '../index';
import { prisma } from '../prismaClient';
import { VoteDto } from '../dtos';

export class VoteService {
  async submitVote(data: VoteDto) {
    const { pollId, studentName, optionId } = data;

    // Check if poll is open
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll || poll.status !== 'OPEN') {
      throw new Error('Poll is not active');
    }

    // Check if duplicate vote needs to be handled
    // Prisma unique constraint will handle this, but let's be graceful
    // "Race Conditions: Ensure that a student cannot vote more than once"
    
    // We try to create vote
    try {
      const vote = await prisma.vote.create({
        data: {
          pollId,
          student: studentName,
          optionId,
        },
      });

      // Update option vote count? 
      // If we calculate aggregates on fly, we don't need to store count on Option. 
      // But for performance, or if Option model has 'votes', we might not need to update it if it's just a relation count.
      // My Prisma schema has relation votes Vote[], so we can count them.
      
      // Emit update to teacher
      // We should probably broadcast the updated poll state or just the new vote 
      // Broadcasting full poll or aggregates is easier for client sync.
      
      const updatedPoll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: { 
          options: {
            include: {
              _count: { select: { votes: true } }
            }
          } 
        }
      });
      
      // Transform Prisma count to our expected shape if needed
      // Or client handles it.
      // Let's send a simplified object for 'vote:update'
      
      const pollPayload = {
        ...updatedPoll,
        options: updatedPoll?.options.map((o: any) => ({
          ...o,
          votes: o._count.votes
        }))
      };

      io.emit('vote:update', pollPayload);
      
      return vote;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new Error('You have already voted');
      }
      throw e;
    }
  }
}
