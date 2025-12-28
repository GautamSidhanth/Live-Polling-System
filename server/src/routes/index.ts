import { Router } from 'express';
import { PollController } from '../controllers/PollController';
import { VoteController } from '../controllers/VoteController';

const router = Router();
const pollController = new PollController();
const voteController = new VoteController();

router.post('/polls', pollController.createPoll);
router.get('/polls/current', pollController.getActivePoll);
router.post('/votes', voteController.submitVote);
router.get('/polls/history', pollController.getPollHistory);

export default router;
