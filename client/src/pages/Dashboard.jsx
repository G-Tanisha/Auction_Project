import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import api from '../services/api';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const Dashboard = () => {
  const [myAuctions, setMyAuctions] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      const [auctionResponse, bidResponse] = await Promise.all([
        api.get('/dashboard/my-auctions'),
        api.get('/dashboard/my-bids')
      ]);
      setMyAuctions(auctionResponse.data.auctions);
      setMyBids(bidResponse.data.bids);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-tide">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Dashboard</h1>
        </div>
        <Link
          to="/create"
          className="focus-ring w-fit rounded-md bg-tide px-4 py-2 font-bold text-white hover:bg-teal-800"
        >
          Create auction
        </Link>
      </div>

      {error && <div className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && <p className="text-slate-600">Loading dashboard...</p>}

      {!loading && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-ink">My auctions</h2>
            <div className="space-y-3">
              {myAuctions.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
                  No auctions created yet.
                </div>
              )}
              {myAuctions.map((auction) => (
                <Link
                  key={auction._id}
                  to={`/auctions/${auction._id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-tide"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink">{auction.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Highest bid: {currency.format(auction.currentHighestBid)}
                      </p>
                    </div>
                    <Countdown endTime={auction.endTime} status={auction.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Winner: {auction.winner?.name || (auction.status === 'closed' ? 'No bids' : 'Pending')}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-ink">My bids</h2>
            <div className="space-y-3">
              {myBids.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
                  No bids placed yet.
                </div>
              )}
              {myBids.map((bid) => (
                <Link
                  key={bid._id}
                  to={`/auctions/${bid.auction?._id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-tide"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink">{bid.auction?.title || 'Auction removed'}</h3>
                      <p className="mt-1 text-sm text-slate-600">Your bid: {currency.format(bid.amount)}</p>
                    </div>
                    {bid.auction && <Countdown endTime={bid.auction.endTime} status={bid.auction.status} />}
                  </div>
                  {bid.auction && (
                    <p className="mt-3 text-sm text-slate-600">
                      Current highest: {currency.format(bid.auction.currentHighestBid)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
