export enum PollStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: Option[];
  duration: number; // in seconds
  createdAt: string;
  status: PollStatus;
  correctOptionId?: string; // If applicable
}

export interface CreatePollDto {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  duration: number;
}


// Server specific types might be superset, but this is good for client
