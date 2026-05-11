import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endTime: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/auctions', form);
      navigate(`/auctions/${data.auction._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-tide">Seller console</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Create auction</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {error && <div className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Title
            <input
              type="text"
              required
              maxLength="120"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Starting price
            <input
              type="number"
              required
              min="1"
              value={form.startingPrice}
              onChange={(event) => updateField('startingPrice', event.target.value)}
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            End time
            <input
              type="datetime-local"
              required
              value={form.endTime}
              onChange={(event) => updateField('endTime', event.target.value)}
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Image URL
            <input
              type="url"
              required
              value={form.imageUrl}
              onChange={(event) => updateField('imageUrl', event.target.value)}
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Description
            <textarea
              required
              rows="5"
              maxLength="1000"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring mt-6 rounded-md bg-tide px-5 py-2 font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Publishing...' : 'Publish auction'}
        </button>
      </form>
    </section>
  );
};

export default CreateAuction;
