import express from 'express';
import { placeBid } from '../controllers/bidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:auctionId', protect, placeBid);

export default router;
