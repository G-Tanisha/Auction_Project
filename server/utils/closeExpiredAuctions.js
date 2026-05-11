import Auction from '../models/Auction.js';

export const closeExpiredAuctionById = async (auctionId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    return null;
  }

  if (auction.status === 'active' && auction.endTime <= new Date()) {
    auction.status = 'closed';
    auction.winner = auction.currentHighestBidder || null;
    await auction.save();
  }

  return Auction.findById(auction._id)
    .populate('seller', 'name email')
    .populate('currentHighestBidder', 'name email')
    .populate('winner', 'name email');
};

export const closeExpiredAuctions = async (io) => {
  const expiredAuctions = await Auction.find({
    status: 'active',
    endTime: { $lte: new Date() }
  });

  await Promise.all(
    expiredAuctions.map(async (auction) => {
      auction.status = 'closed';
      auction.winner = auction.currentHighestBidder || null;
      await auction.save();

      const populated = await Auction.findById(auction._id)
        .populate('seller', 'name email')
        .populate('currentHighestBidder', 'name email')
        .populate('winner', 'name email');

      io.to(`auction:${auction._id}`).emit('auctionEnded', populated);
      io.emit('auctionsUpdated', { auctionId: auction._id, status: 'closed' });
    })
  );
};

export const startAuctionExpiryJob = (io) => {
  closeExpiredAuctions(io).catch((error) => {
    console.error('Initial auction expiry check failed:', error.message);
  });

  return setInterval(() => {
    closeExpiredAuctions(io).catch((error) => {
      console.error('Auction expiry job failed:', error.message);
    });
  }, 15000);
};
