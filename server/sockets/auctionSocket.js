export const registerAuctionSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinAuction', (auctionId) => {
      if (auctionId) {
        socket.join(`auction:${auctionId}`);
      }
    });

    socket.on('leaveAuction', (auctionId) => {
      if (auctionId) {
        socket.leave(`auction:${auctionId}`);
      }
    });
  });
};
