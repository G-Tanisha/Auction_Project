import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';
import { closeExpiredAuctionById } from '../utils/closeExpiredAuctions.js';

const populateAuction = (query) =>
  query
    .populate('seller', 'name email')
    .populate('currentHighestBidder', 'name email')
    .populate('winner', 'name email');

export const listAuctions = async (req, res, next) => {
  try {
    const auctions = await populateAuction(
      Auction.find({}).sort({ status: 1, endTime: 1 }).limit(60)
    );
    res.json({ auctions });
  } catch (error) {
    next(error);
  }
};

export const createAuction = async (req, res, next) => {
  try {
    const { title, description, startingPrice, endTime, imageUrl } = req.body;
    const parsedPrice = Number(startingPrice);
    const parsedEndTime = new Date(endTime);

    if (!title || !description || !imageUrl || Number.isNaN(parsedPrice) || !endTime) {
      res.status(400);
      throw new Error('Title, description, image URL, starting price and end time are required');
    }

    if (parsedEndTime <= new Date()) {
      res.status(400);
      throw new Error('End time must be in the future');
    }

    const auction = await Auction.create({
      title,
      description,
      imageUrl,
      startingPrice: parsedPrice,
      currentHighestBid: parsedPrice,
      seller: req.user._id,
      endTime: parsedEndTime
    });

    const populated = await populateAuction(Auction.findById(auction._id));
    req.io.emit('auctionsUpdated', { auctionId: auction._id, status: 'active' });

    res.status(201).json({ auction: populated });
  } catch (error) {
    next(error);
  }
};

export const getAuction = async (req, res, next) => {
  try {
    const auction = await closeExpiredAuctionById(req.params.id);

    if (!auction) {
      res.status(404);
      throw new Error('Auction not found');
    }

    const bids = await Bid.find({ auction: auction._id })
      .populate('bidder', 'name email')
      .sort({ amount: -1, createdAt: -1 })
      .limit(25);

    res.json({ auction, bids });
  } catch (error) {
    next(error);
  }
};

export const closeAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      res.status(404);
      throw new Error('Auction not found');
    }

    const isSeller = auction.seller.toString() === req.user._id.toString();
    const isExpired = auction.endTime <= new Date();

    if (!isSeller && !isExpired) {
      res.status(403);
      throw new Error('Only the seller can close this auction before expiry');
    }

    auction.status = 'closed';
    auction.winner = auction.currentHighestBidder || null;
    await auction.save();

    const populated = await populateAuction(Auction.findById(auction._id));
    req.io.to(`auction:${auction._id}`).emit('auctionEnded', populated);
    req.io.emit('auctionsUpdated', { auctionId: auction._id, status: 'closed' });

    res.json({ auction: populated });
  } catch (error) {
    next(error);
  }
};
