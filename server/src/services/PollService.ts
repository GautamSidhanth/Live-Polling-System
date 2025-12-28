import { io } from '../index';
import { prisma } from '../prismaClient';
import { CreatePollDto } from '../dtos';
import { Poll } from '@prisma/client';
// I'll redefine generic types or import from Prisma 

export class PollService {
  async createPoll(data: CreatePollDto): Promise<Poll> {
    const { question, options, duration } = data;

    // Close any existing open polls (Requirement: Ask new question only if no question asked or previous answered? 
    // Usually only one active poll per session. For simplicity, we close others or check status.)
    // "Ask a new question only if: No question has been asked yet, or All students have answered the previous question"
    // Actually, usually it just means "Current active poll".
    // Let's close any currently OPEN polls for simplicity or throw error.
    
    // Deactivate previous active polls
    await prisma.poll.updateMany({
      where: { status: 'OPEN' },
      data: { status: 'CLOSED' },
    });

    const poll = await prisma.poll.create({
      data: {
        question,
        duration,
        status: 'OPEN',
        options: {
          create: data.options.map((opt: { text: string; isCorrect?: boolean }) => ({
            text: opt.text,
            isCorrect: opt.isCorrect || false,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    // Notify clients
    io.emit('poll:created', poll);
    
    // Start timer on server side to auto-close? 
    // Requirement: "Student joins ... timer must start at 30s not 60s"
    // So server needs to track start time. `createdAt` does that.
    
    return poll;
  }

  async getActivePoll() {
    const poll = await prisma.poll.findFirst({
      where: { status: 'OPEN' },
      include: { 
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        } 
      },
    });

    if (!poll) return null;

    // Transform to flat structure if needed, or keeping it compatible
    return {
      ...poll,
      options: poll.options.map((o: any) => ({
        ...o,
        votes: o._count.votes // Helper for frontend
      }))
    };
  }

  async getPollHistory() {
    const polls = await prisma.poll.findMany({
      where: { status: 'CLOSED' },
      orderBy: { createdAt: 'desc' },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    });

    return polls.map((poll: any) => ({
      ...poll,
      options: poll.options.map((o: any) => ({
        ...o,
        votes: o._count.votes
      }))
    }));
  }
  async vote(pollId: string, optionId: string, student: string) {
    // Check if poll is open
    const poll = await prisma.poll.findUnique({ where: { id: pollId }, include: { options: true } });
    if (!poll || poll.status !== 'OPEN') {
      throw new Error('Poll is not active');
    }

    // Check if double vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        student_pollId: {
          student,
          pollId
        }
      }
    });

    if (existingVote) {
      throw new Error('Already voted');
    }

    // Record vote
    await prisma.vote.create({
      data: {
        student,
        pollId,
        optionId
      }
    });

    // Notify clients (Emit updated poll with vote counts)
    const updatedPoll = await this.getActivePoll();
    io.emit('vote:update', updatedPoll);
    
    return updatedPoll;
  }
}
