import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function MyTicketsPage() {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [ordersData, eventsData] = await Promise.all([api.myOrders(), api.listEvents()]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : eventsData.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const eventMap = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);

  return (
    <section className="stacked-panel">
      <div className="hero-card card">
        <p className="kicker">My Tickets</p>
        <h1>Order History</h1>
        <p className="status">Track your booking and payment history.</p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="grid">
        {orders.map((order) => {
          const event = eventMap.get(order.eventId);
          return (
            <article key={order.id} className="card event-card">
              <h2>{event?.title || 'Event'}</h2>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>Total:</strong> {order.totalAmount}
              </p>
              <p>
                <strong>Date:</strong> {order.registrationDate}
              </p>
              {event ? (
                <Link className="solid-btn inline" to={`/events/${event.id}`}>
                  View Event
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>

      {!loading && !error && orders.length === 0 ? (
        <p className="status">No ticket orders yet. Buy one from an event detail page.</p>
      ) : null}
    </section>
  );
}
