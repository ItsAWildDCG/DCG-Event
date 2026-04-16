import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function EventStatsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [stats, setStats] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  async function loadManageableEvents() {
    setLoadingEvents(true);
    setError('');
    try {
      const data = await api.listManageEvents();
      const items = Array.isArray(data) ? data : data.items || [];
      setEvents(items);
      if (items.length > 0) {
        setSelectedEventId((prev) => prev || items[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadStats(eventId) {
    if (!eventId) {
      setStats(null);
      return;
    }

    setLoadingStats(true);
    setError('');
    try {
      const data = await api.getEventStats(eventId);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    loadManageableEvents();
  }, []);

  useEffect(() => {
    loadStats(selectedEventId);
  }, [selectedEventId]);

  const totals = stats?.totals;

  return (
    <section className="stacked-panel">
      <div className="card">
        <h1>Event Statistics</h1>
        <p className="status">Track performance for events you can manage.</p>

        {loadingEvents ? <p className="status">Loading manageable events...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {events.length > 0 ? (
          <label className="search-field">
            Select Event
            <select
              className="pixel-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {!loadingEvents && events.length === 0 ? (
          <p className="status">You do not have any manageable events yet.</p>
        ) : null}
      </div>

      {loadingStats ? <p className="status">Loading statistics...</p> : null}

      {totals ? (
        <div className="grid dashboard-summary-grid">
          <article className="card summary-tile">
            <p className="kicker">Revenue</p>
            <h2>${totals.revenue.toFixed(2)}</h2>
            <p className="status">From {totals.orders} paid order(s)</p>
          </article>
          <article className="card summary-tile">
            <p className="kicker">Tickets</p>
            <h2>{totals.ticketsSold} sold</h2>
            <p className="status">{totals.ticketsRemaining} remaining</p>
          </article>
          <article className="card summary-tile">
            <p className="kicker">Inventory</p>
            <h2>{totals.inventoryUsedPercent}% sold</h2>
            <p className="status">
              {totals.ticketsSold} sold of {totals.ticketInventory} total tickets
            </p>
          </article>
          <article className="card summary-tile">
            <p className="kicker">Reviews</p>
            <h2>{totals.averageRating}/5</h2>
            <p className="status">{totals.reviews} review(s)</p>
          </article>
        </div>
      ) : null}

      {stats?.event ? (
        <div className="card">
          <h2>{stats.event.title}</h2>
          <p className="status">
            {stats.event.date} | {stats.event.location}
          </p>
          <div className="action-row">
            <Link className="ghost-btn" to={`/events/${stats.event.id}`}>
              Open Event
            </Link>
            <Link className="solid-btn" to={`/events/${stats.event.id}/edit`}>
              Edit Event
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
