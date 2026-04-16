import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function EventDetailPage() {
  const { eventId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError('');

    try {
      const ev = await api.getEvent(eventId);
      setEvent(ev);

      if (isAuthenticated) {
        const regs = await api.listRegistrations(eventId);
        setRegistrations(regs);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [eventId, isAuthenticated]);

  async function handleRegister() {
    setMessage('');
    setError('');
    try {
      await api.registerForEvent(eventId);
      setMessage('Registration successful');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this event?')) {
      return;
    }

    try {
      await api.deleteEvent(eventId);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="status">Loading event...</p>;
  }

  if (error && !event) {
    return <p className="error">{error}</p>;
  }

  return (
    <section className="card detail-card">
      <h1>{event.title}</h1>
      <p>{event.description || 'No description.'}</p>
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Capacity:</strong> {event.capacity}
      </p>
      {message ? <p className="success">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="action-row">
        {isAuthenticated ? (
          <>
            <button className="solid-btn" onClick={handleRegister}>
              Register
            </button>
            {isAdmin ? (
              <>
                <Link className="ghost-btn" to={`/events/${eventId}/edit`}>
                  Edit
                </Link>
                <button className="ghost-btn" onClick={handleDelete}>
                  Delete
                </button>
              </>
            ) : null}
          </>
        ) : (
          <Link className="solid-btn" to="/login">
            Login to Register
          </Link>
        )}
      </div>
      {isAdmin ? (
        <div>
          <h2>Registrations</h2>
          <p>{registrations.length} attendee(s)</p>
        </div>
      ) : null}
    </section>
  );
}
