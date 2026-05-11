import express from 'express';
import {
  closeAuction,
  createAuction,
  getAuction,
  listAuctions
} from '../controllers/auctionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listAuctions);
router.post('/', protect, createAuction);
router.get('/:id', getAuction);
router.put('/:id/close', protect, closeAuction);

export default router;
