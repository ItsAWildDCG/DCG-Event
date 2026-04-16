import { ApiError } from '../utils/apiError.js';

export function createCommerceService(eventsRepository, domainRepository) {
  async function createTicket(eventId, payload) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (!payload.type || payload.price === undefined || payload.quantityAvailable === undefined) {
      throw new ApiError(400, 'type, price, quantityAvailable are required');
    }

    return domainRepository.createTicket({
      eventId,
      type: payload.type,
      price: Number(payload.price),
      quantityAvailable: Number(payload.quantityAvailable)
    });
  }

  async function listTicketsByEvent(eventId) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    return domainRepository.listTicketsByEvent(eventId);
  }

  async function createOrderAndPayment(userId, eventId, payload) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const ticket = await domainRepository.getTicketById(payload.ticketId);
    if (!ticket || ticket.eventId !== eventId) {
      throw new ApiError(404, 'Ticket not found for this event');
    }

    const quantity = Number(payload.quantity || 1);
    if (Number.isNaN(quantity) || quantity < 1) {
      throw new ApiError(400, 'quantity must be a positive number');
    }

    if (ticket.quantityAvailable < quantity) {
      throw new ApiError(409, 'Not enough ticket quantity available');
    }

    const totalAmount = Number(ticket.price) * quantity;
    const now = new Date().toISOString();

    await domainRepository.updateTicket(ticket.id, {
      quantityAvailable: Number(ticket.quantityAvailable) - quantity
    });

    const order = await domainRepository.createOrder({
      userId,
      eventId,
      ticketId: ticket.id,
      quantity,
      totalAmount,
      status: 'paid',
      registrationDate: now
    });

    const payment = await domainRepository.createPayment({
      orderId: order.id,
      amount: totalAmount,
      paymentMethod: payload.paymentMethod || 'mock-gateway',
      paymentStatus: 'paid',
      paymentDate: now
    });

    return { order, payment };
  }

  async function listOrdersByUser(userId) {
    return domainRepository.listOrdersByUser(userId);
  }

  async function listOrdersByEvent(eventId) {
    return domainRepository.listOrdersByEvent(eventId);
  }

  async function listPaymentsByOrder(orderId) {
    return domainRepository.listPaymentsByOrder(orderId);
  }

  return {
    createTicket,
    listTicketsByEvent,
    createOrderAndPayment,
    listOrdersByUser,
    listOrdersByEvent,
    listPaymentsByOrder
  };
}
