import express from 'express';
import { myAuctions, myBids } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-auctions', protect, myAuctions);
router.get('/my-bids', protect, myBids);

export default router;
