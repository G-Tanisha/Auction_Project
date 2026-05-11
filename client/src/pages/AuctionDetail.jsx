import { Send } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Countdown from '../components/Countdown';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getSocket } from '../services/socket';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const AuctionDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAuction = useCallback(async () => {
    try {
      const { data } = await api.get(`/auctions/${id}`);
      setAuction(data.auction);
      setBids(data.bids);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAuction();
  }, [loadAuction]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinAuction', id);

    const handleBid = ({ auction: nextAuction, bid }) => {
      setAuction(nextAuction);
      setBids((current) => [bid, ...current.filter((item) => item._id !== bid._id)]);
      setSuccess('New bid received live');
      setTimeout(() => setSuccess(''), 2000);
    };

    const handleEnded = (nextAuction) => {
      setAuction(nextAuction);
      setSuccess('Auction has ended');
    };

    socket.on('bidPlaced', handleBid);
    socket.on('auctionEnded', handleEnded);

    return () => {
      socket.emit('leaveAuction', id);
      socket.off('bidPlaced', handleBid);
      socket.off('auctionEnded', handleEnded);
    };
  }, [id]);

  const minimumBid = useMemo(() => {
    if (!auction) {
      return 1;
    }
    return Math.max(auction.startingPrice, auction.currentHighestBid) + 1;
  }, [auction]);

  const isSeller = auction?.seller?._id === user?.id;
  const isClosed = auction?.status === 'closed' || new Date(auction?.endTime || 0) <= new Date();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post(`/bids/${id}`, { amount: Number(bidAmount) });
      setAuction(data.auction);
      setBids((current) => [data.bid, ...current.filter((item) => item._id !== data.bid._id)]);
      setBidAmount('');
      setSuccess('Bid placed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading auction...</div>;
  }

  if (!auction) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error || 'Auction not found'}</div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {error && <div className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-5 rounded-md bg-teal-50 p-3 text-sm text-teal-800">{success}</div>}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <img src={auction.imageUrl} alt={auction.title} className="h-72 w-full object-cover sm:h-96" />
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-tide">{auction.status}</p>
                <h1 className="mt-1 text-3xl font-bold text-ink">{auction.title}</h1>
              </div>
              <Countdown endTime={auction.endTime} status={auction.status} onExpire={loadAuction} />
            </div>
            <p className="text-slate-700">{auction.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Starting price</p>
                <p className="text-lg font-bold">{currency.format(auction.startingPrice)}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Highest bid</p>
                <p className="text-lg font-bold text-tide">{currency.format(auction.currentHighestBid)}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Winner</p>
                <p className="text-lg font-bold">{auction.winner?.name || (isClosed ? 'No bids' : 'Pending')}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Place bid</h2>
            <p className="mt-1 text-sm text-slate-600">Minimum bid: {currency.format(minimumBid)}</p>
            {!isAuthenticated && (
              <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                <Link to="/login" className="font-semibold underline">
                  Login
                </Link>{' '}
                to place a bid.
              </p>
            )}
            {isAuthenticated && isSeller && (
              <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                You are the seller for this auction.
              </p>
            )}
            {isAuthenticated && !isSeller && !isClosed && (
              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                  type="number"
                  min={minimumBid}
                  required
                  value={bidAmount}
                  onChange={(event) => setBidAmount(event.target.value)}
                  className="focus-ring min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-coral px-4 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send size={16} /> Bid
                </button>
              </form>
            )}
            {isClosed && <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">Bidding is closed.</p>}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Bid history</h2>
            <div className="mt-4 space-y-3">
              {bids.length === 0 && <p className="text-sm text-slate-600">No bids yet.</p>}
              {bids.map((bid) => (
                <div key={bid._id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-ink">{bid.bidder?.name || 'Bidder'}</p>
                    <p className="text-xs text-slate-500">{new Date(bid.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-tide">{currency.format(bid.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AuctionDetail;
