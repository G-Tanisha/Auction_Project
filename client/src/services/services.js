import api from './api';

export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const auctionService = {
  getAuctions: () => api.get('/auctions'),
  getAuction: (id) => api.get(`/auctions/${id}`),
  createAuction: (data) => api.post('/auctions', data),
  getUserAuctions: () => api.get('/auctions/user/my-auctions'),
  closeAuction: (id) => api.put(`/auctions/${id}/close`),
};

export const bidService = {
  placeBid: (auctionId, bidAmount) =>
    api.post('/bids', { auctionId, bidAmount }),
  getUserBids: () => api.get('/bids/user/my-bids'),
  getAuctionBids: (auctionId) => api.get(`/bids/auction/${auctionId}`),
};
