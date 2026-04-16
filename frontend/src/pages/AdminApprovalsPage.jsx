import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function AdminApprovalsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function loadPending() {
    setLoading(true);
    setError('');
    try {
      const data = await api.listPendingEvents();
      setEvents(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(eventId) {
    setError('');
    setStatus('');
    try {
      await api.approveEvent(eventId);
      setStatus('Event approved successfully.');
      await loadPending();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="admin-wrap">
      <div className="card admin-card">
        <h1>Event Approvals</h1>
        <p className="status">Review organizer submissions and approve publishing.</p>
        {status ? <p className="success">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {loading ? <p className="status">Loading pending events...</p> : null}
        <div className="admin-list">
          {events.map((event) => (
            <article key={event.id} className="admin-row">
              <div>
                <h3>{event.title}</h3>
                <p>
                  {event.date} | {event.location}
                </p>
                <p className="status">Organizer ID: {event.organizerId || 'n/a'}</p>
              </div>
              <div className="action-row">
                <Link className="ghost-btn" to={`/events/${event.id}`}>
                  Preview
                </Link>
                <button className="solid-btn" onClick={() => handleApprove(event.id)}>
                  Approve
                </button>
              </div>
            </article>
          ))}
        </div>
        {!loading && events.length === 0 ? (
          <p className="status">No pending events. All caught up.</p>
        ) : null}
      </div>
    </section>
  );
}
