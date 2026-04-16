import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

const initialState = {
  title: '',
  description: '',
  date: '',
  location: ''
};

export function EventFormPage({ mode }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    api
      .getEvent(eventId)
      .then((event) => {
        setForm({
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mode, eventId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const payload = { ...form };

    try {
      if (mode === 'create') {
        const created = await api.createEvent(payload);
        navigate(`/events/${created.id}`);
      } else {
        const updated = await api.updateEvent(eventId, payload);
        navigate(`/events/${updated.id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="status">Loading form...</p>;
  }

  return (
    <section className="card form-card">
      <h1>{mode === 'create' ? 'Create Event' : 'Edit Event'}</h1>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            rows={4}
          />
        </label>
        <label>
          Date
          <input
            value={form.date}
            onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
            placeholder="2026-05-01 18:30"
            required
          />
        </label>
        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="solid-btn">{mode === 'create' ? 'Create Event' : 'Save Changes'}</button>
      </form>
    </section>
  );
}
