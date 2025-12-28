import { Poll, Option, Vote } from '@prisma/client';

export interface CreatePollDto {
  question: string;
  duration: number;
  options: { text: string }[];
}

export interface VoteDto {
  pollId: string;
  studentName: string;
  optionId: string;
}

export type { Poll, Option, Vote };
