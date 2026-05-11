import mongoose from 'mongoose';
import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';

const populateAuction = (query) =>
  query
    .populate('seller', 'name email')
    .populate('currentHighestBidder', 'name email')
    .populate('winner', 'name email');

export const placeBid = async (req, res, next) => {
  try {
    const { auctionId } = req.params;
    const amount = Number(req.body.amount);

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      res.status(400);
      throw new Error('Invalid auction id');
    }

    if (Number.isNaN(amount) || amount <= 0) {
      res.status(400);
      throw new Error('Bid amount must be a positive number');
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      res.status(404);
      throw new Error('Auction not found');
    }

    if (auction.seller.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Seller cannot bid on their own auction');
    }

    if (auction.status !== 'active' || auction.endTime <= new Date()) {
      auction.status = 'closed';
      auction.winner = auction.currentHighestBidder || null;
      await auction.save();
      res.status(400);
      throw new Error('Auction is closed');
    }

    const minimumBid = Math.max(auction.startingPrice, auction.currentHighestBid) + 1;
    if (amount < minimumBid) {
      res.status(400);
      throw new Error(`Bid must be at least ${minimumBid}`);
    }

    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        status: 'active',
        endTime: { $gt: new Date() },
        currentHighestBid: { $lt: amount }
      },
      {
        currentHighestBid: amount,
        currentHighestBidder: req.user._id
      },
      { new: true, runValidators: true }
    );

    if (!updatedAuction) {
      res.status(409);
      throw new Error('A higher bid was placed. Please try again.');
    }

    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount
    });

    const populatedBid = await Bid.findById(bid._id).populate('bidder', 'name email');
    const populatedAuction = await populateAuction(Auction.findById(auctionId));

    req.io.to(`auction:${auctionId}`).emit('bidPlaced', {
      auction: populatedAuction,
      bid: populatedBid
    });
    req.io.emit('auctionsUpdated', { auctionId, currentHighestBid: amount });

    res.status(201).json({ auction: populatedAuction, bid: populatedBid });
  } catch (error) {
    next(error);
  }
};
