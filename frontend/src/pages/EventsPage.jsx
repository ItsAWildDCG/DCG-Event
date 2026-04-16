import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadEvents(currentSearch = search) {
    setLoading(true);
    setError('');
    try {
      const data = await api.listEvents({ search: currentSearch });
      setEvents(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadEvents(search);
    }, 220);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section>
      <div className="section-head">
        <h1>Upcoming Events</h1>
        <button className="ghost-btn" onClick={() => loadEvents(search)}>
          Refresh
        </button>
      </div>
      <div className="toolbar">
        <label className="search-field">
          Search Events
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by title, location, description, date"
          />
        </label>
        <div className="result-pill">{events.length} shown</div>
      </div>
      {loading ? <p className="status">Loading events...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="grid">
        {events.map((event) => (
          <article key={event.id} className="card event-card">
            <h2>{event.title}</h2>
            <p>{event.description || 'No description yet.'}</p>
            <p>
              <strong>When:</strong> {event.date}
            </p>
            <p>
              <strong>Where:</strong> {event.location}
            </p>
            <p>
              <strong>Capacity:</strong> {event.capacity}
            </p>
            <Link className="solid-btn inline" to={`/events/${event.id}`}>
              View details
            </Link>
          </article>
        ))}
      </div>
      {!loading && events.length === 0 ? (
        <p className="status">No events match your search. Try a different keyword.</p>
      ) : null}
    </section>
  );
}
