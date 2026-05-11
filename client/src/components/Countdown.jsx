import { useEffect, useMemo, useState } from 'react';

const formatTime = (milliseconds) => {
  if (milliseconds <= 0) {
    return 'Closed';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
};

const Countdown = ({ endTime, status, onExpire }) => {
  const end = useMemo(() => new Date(endTime).getTime(), [endTime]);
  const [remaining, setRemaining] = useState(end - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const nextRemaining = end - Date.now();
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [end, onExpire]);

  const isClosed = status === 'closed' || remaining <= 0;

  return (
    <span
      className={`inline-flex min-w-28 justify-center rounded-md px-3 py-1 text-sm font-semibold ${
        isClosed ? 'bg-slate-200 text-slate-700' : 'bg-gold/20 text-amber-900'
      }`}
    >
      {isClosed ? 'Closed' : formatTime(remaining)}
    </span>
  );
};

export default Countdown;
