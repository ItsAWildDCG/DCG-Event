import { useEffect, useState } from 'react';
import { api } from '../services/api';

const initialForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: 60
};

export function AdminPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 4;

  async function loadEvents() {
    setLoading(true);
    setError('');
    try {
      const data = await api.listEvents({ search, page, limit: pageSize });
      const items = Array.isArray(data) ? data : data.items || [];
      setEvents(items);
      setTotalPages(Array.isArray(data) ? 1 : data.totalPages || 1);
      setTotalItems(Array.isArray(data) ? items.length : data.totalItems || items.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [search, page]);

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      await api.createEvent({
        ...form,
        capacity: Number(form.capacity)
      });
      setForm(initialForm);
      setStatus('Event created.');
      setPage(1);
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(eventId) {
    if (!confirm('Delete this event?')) {
      return;
    }

    setError('');
    setStatus('');

    try {
      await api.deleteEvent(eventId);
      setStatus('Event deleted.');
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  function goToPage(nextPage) {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    setPage(safePage);
  }

  return (
    <section className="admin-wrap">
      <div className="card admin-card">
        <h1>Admin Portal</h1>
        <p className="status">Manage events from one control panel.</p>
        <div className="toolbar">
          <label className="search-field">
            Search
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="title, location, date..."
            />
          </label>
          <div className="result-pill">{totalItems} events</div>
        </div>
        <form className="form-grid" onSubmit={handleCreate}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />
          </label>
          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </label>
          <label>
            Date
            <input
              required
              placeholder="2026-05-30 19:00"
              value={form.date}
              onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
            />
          </label>
          <label>
            Location
            <input
              required
              value={form.location}
              onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
            />
          </label>
          <label>
            Capacity
            <input
              required
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm((s) => ({ ...s, capacity: e.target.value }))}
            />
          </label>
          <button className="solid-btn">Create Event</button>
        </form>
      </div>

      <div className="card admin-card">
        <h2>Current Events</h2>
        {status ? <p className="success">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {loading ? <p className="status">Loading events...</p> : null}
        <div className="admin-list">
          {events.map((event) => (
            <article key={event.id} className="admin-row">
              <div>
                <h3>{event.title}</h3>
                <p>
                  {event.date} | {event.location} | cap {event.capacity}
                </p>
              </div>
              <button className="ghost-btn" onClick={() => handleDelete(event.id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
        <div className="pagination">
          <button className="ghost-btn" type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
            Prev
          </button>
          <span className="result-pill">
            Page {page} of {totalPages}
          </span>
          <button className="ghost-btn" type="button" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
