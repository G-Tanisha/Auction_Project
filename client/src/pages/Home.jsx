import { RefreshCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AuctionCard from '../components/AuctionCard';
import api from '../services/api';
import { getSocket } from '../services/socket';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAuctions = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/auctions');
      setAuctions(data.auctions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuctions();
    const socket = getSocket();
    socket.on('auctionsUpdated', loadAuctions);
    return () => socket.off('auctionsUpdated', loadAuctions);
  }, [loadAuctions]);

  const activeAuctions = useMemo(
    () => auctions.filter((auction) => auction.status === 'active' && new Date(auction.endTime) > new Date()),
    [auctions]
  );
  const closedAuctions = useMemo(
    () => auctions.filter((auction) => auction.status === 'closed' || new Date(auction.endTime) <= new Date()),
    [auctions]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-tide">Live marketplace</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">BidStream Auctions</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse active auctions, place bids, and watch prices update in real time.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAuctions}
          className="focus-ring inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RefreshCcw size={18} /> Refresh
        </button>
      </div>

      {error && <div className="mb-6 rounded-md bg-red-50 p-3 text-red-700">{error}</div>}
      {loading && <p className="text-slate-600">Loading auctions...</p>}

      {!loading && activeAuctions.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-ink">No active auctions yet</h2>
          <p className="mt-2 text-slate-600">Create an auction to start the first live bidding room.</p>
        </div>
      )}

      {activeAuctions.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeAuctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}

      {closedAuctions.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-ink">Recently closed</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {closedAuctions.slice(0, 6).map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
