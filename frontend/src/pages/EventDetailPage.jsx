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
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [ticketQty, setTicketQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const hasPaidTickets = tickets.some((ticket) => Number(ticket.price) > 0);
  const isFreeEntryEvent = !hasPaidTickets;

  async function load() {
    setLoading(true);
    setError('');

    try {
      const ev = await api.getEvent(eventId);
      setEvent(ev);

      const [ticketData, reviewData] = await Promise.all([
        api.listEventTickets(eventId),
        api.listEventReviews(eventId)
      ]);
      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      if (Array.isArray(ticketData) && ticketData.length > 0) {
        const paidTicket = ticketData.find((ticket) => Number(ticket.price) > 0);
        setSelectedTicketId((prev) => prev || paidTicket?.id || ticketData[0].id);
      }

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

  async function handleBuyTicket() {
    if (!selectedTicketId) {
      setError('Please select a ticket type');
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.createOrder(eventId, {
        ticketId: selectedTicketId,
        quantity: Number(ticketQty),
        paymentMethod: 'mock-gateway'
      });
      setMessage('Ticket order created and payment recorded. Check My Tickets.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.addEventReview(eventId, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      setMessage('Review saved.');
      setReviewForm({ rating: 5, comment: '' });
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
      <p className="detail-description">{event.description || 'No description.'}</p>
      <p className="detail-meta">
        <strong>Date:</strong> {event.date}
      </p>
      <p className="detail-meta">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="detail-meta">
        <strong>Capacity:</strong> {event.capacity}
      </p>
      {message ? <p className="success">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="action-row detail-cta-row">
        {isAuthenticated ? (
          <>
            {isFreeEntryEvent ? (
              <button className="solid-btn" onClick={handleRegister}>
                Join Free Event
              </button>
            ) : null}
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
            {isFreeEntryEvent ? 'Login to Join Free Event' : 'Login to Buy Ticket'}
          </Link>
        )}
      </div>

      <div className="card form-card">
        <h2>Buy Ticket</h2>
        {!hasPaidTickets ? (
          <p className="status">This event is free entry. No ticket purchase is required.</p>
        ) : (
          <div className="form-grid">
            <label>
              Ticket Type
              <div className="pixel-select-wrap">
                <select
                  value={selectedTicketId}
                  onChange={(e) => setSelectedTicketId(e.target.value)}
                  className="pixel-select"
                >
                  {tickets.map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      {ticket.type} - {ticket.price} (left: {ticket.quantityAvailable})
                    </option>
                  ))}
                </select>
                <span className="pixel-select-arrow" aria-hidden="true">
                  v
                </span>
              </div>
            </label>
            <label>
              Quantity
              <input
                type="number"
                min={1}
                value={ticketQty}
                onChange={(e) => setTicketQty(e.target.value)}
              />
            </label>
            {isAuthenticated ? (
              <button className="solid-btn" onClick={handleBuyTicket}>
                Buy Ticket
              </button>
            ) : (
              <p className="status">Use the login button above to continue.</p>
            )}
          </div>
        )}
      </div>

      <div className="card form-card">
        <h2>Reviews</h2>
        <div className="timeline">
          {reviews.map((review) => (
            <article key={review.id} className="timeline-row">
              <div className="timeline-dot" />
              <div>
                <p className="timeline-title">Rating: {review.rating}/5</p>
                <p>{review.comment || 'No comment'}</p>
              </div>
            </article>
          ))}
          {reviews.length === 0 ? <p className="status">No reviews yet.</p> : null}
        </div>

        {isAuthenticated ? (
          <form className="form-grid" onSubmit={handleSubmitReview}>
            <label>
              Rating (1-5)
              <input
                type="number"
                min={1}
                max={5}
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
              />
            </label>
            <label>
              Comment
              <textarea
                rows={3}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              />
            </label>
            <button className="solid-btn">Submit Review</button>
          </form>
        ) : (
          <p className="status">Login to submit a review.</p>
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
