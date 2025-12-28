import { Request, Response } from 'express';
import { VoteService } from '../services/VoteService';

const voteService = new VoteService();

export class VoteController {
  async submitVote(req: Request, res: Response) {
    try {
      const vote = await voteService.submitVote(req.body);
      res.status(201).json(vote);
    } catch (error: any) {
      if (error.message === 'You have already voted') {
        res.status(409).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit vote' });
      }
    }
  }
}
