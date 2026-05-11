import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const AuctionCard = ({ auction }) => (
  <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <img
      src={auction.imageUrl}
      alt={auction.title}
      className="h-48 w-full object-cover"
      loading="lazy"
    />
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="line-clamp-2 text-lg font-bold text-ink">{auction.title}</h2>
          <p className="mt-1 text-sm text-slate-500">Seller: {auction.seller?.name || 'User'}</p>
        </div>
        <Countdown endTime={auction.endTime} status={auction.status} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{auction.description}</p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Highest bid</p>
          <p className="text-xl font-bold text-tide">{currency.format(auction.currentHighestBid)}</p>
        </div>
        <Link
          to={`/auctions/${auction._id}`}
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          View <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  </article>
);

export default AuctionCard;
