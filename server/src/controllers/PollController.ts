import { Request, Response } from 'express';
import { PollService } from '../services/PollService';

const pollService = new PollService();

export class PollController {
  async createPoll(req: Request, res: Response) {
    try {
      const poll = await pollService.createPoll(req.body);
      res.status(201).json(poll);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create poll' });
    }
  }

  async getActivePoll(req: Request, res: Response) {
    try {
      const poll = await pollService.getActivePoll();
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active poll' });
    }
  }

  async getPollHistory(req: Request, res: Response) {
    try {
      const polls = await pollService.getPollHistory();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch poll history' });
    }
  }
}
