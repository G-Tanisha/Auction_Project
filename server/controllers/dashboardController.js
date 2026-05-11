import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';

export const myAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id })
      .populate('currentHighestBidder', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    res.json({ auctions });
  } catch (error) {
    next(error);
  }
};

export const myBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate({
        path: 'auction',
        populate: [
          { path: 'seller', select: 'name email' },
          { path: 'winner', select: 'name email' },
          { path: 'currentHighestBidder', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({ bids });
  } catch (error) {
    next(error);
  }
};
