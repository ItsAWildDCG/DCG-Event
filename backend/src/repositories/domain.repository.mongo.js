import { CategoryModel } from '../models/Category.js';
import { VenueModel } from '../models/Venue.js';
import { TicketModel } from '../models/Ticket.js';
import { OrderModel } from '../models/Order.js';
import { PaymentModel } from '../models/Payment.js';
import { ReviewModel } from '../models/Review.js';

function mapCategory(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapVenue(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    address: doc.address,
    city: doc.city,
    capacity: doc.capacity,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapTicket(doc) {
  return {
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    type: doc.type,
    price: doc.price,
    quantityAvailable: doc.quantityAvailable,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapOrder(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    eventId: doc.eventId.toString(),
    ticketId: doc.ticketId.toString(),
    quantity: doc.quantity,
    totalAmount: doc.totalAmount,
    status: doc.status,
    registrationDate: doc.registrationDate,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapPayment(doc) {
  return {
    id: doc._id.toString(),
    orderId: doc.orderId.toString(),
    amount: doc.amount,
    paymentMethod: doc.paymentMethod,
    paymentStatus: doc.paymentStatus,
    paymentDate: doc.paymentDate,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapReview(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    eventId: doc.eventId.toString(),
    rating: doc.rating,
    comment: doc.comment,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

export const domainRepositoryMongo = {
  async listCategories() {
    const docs = await CategoryModel.find({}).sort({ name: 1 }).exec();
    return docs.map(mapCategory);
  },

  async createCategory(payload) {
    const existing = await CategoryModel.findOne({ name: payload.name }).exec();
    if (existing) {
      return mapCategory(existing);
    }

    const created = await CategoryModel.create(payload);
    return mapCategory(created);
  },

  async getCategoryById(id) {
    const doc = await CategoryModel.findById(id).exec();
    return doc ? mapCategory(doc) : null;
  },

  async listVenues() {
    const docs = await VenueModel.find({}).sort({ city: 1, name: 1 }).exec();
    return docs.map(mapVenue);
  },

  async createVenue(payload) {
    const created = await VenueModel.create(payload);
    return mapVenue(created);
  },

  async getVenueById(id) {
    const doc = await VenueModel.findById(id).exec();
    return doc ? mapVenue(doc) : null;
  },

  async listTicketsByEvent(eventId) {
    const docs = await TicketModel.find({ eventId }).exec();
    return docs.map(mapTicket);
  },

  async createTicket(payload) {
    const created = await TicketModel.create(payload);
    return mapTicket(created);
  },

  async updateTicket(id, updates) {
    const doc = await TicketModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).exec();
    return doc ? mapTicket(doc) : null;
  },

  async getTicketById(id) {
    const doc = await TicketModel.findById(id).exec();
    return doc ? mapTicket(doc) : null;
  },

  async createOrder(payload) {
    const created = await OrderModel.create(payload);
    return mapOrder(created);
  },

  async listOrdersByUser(userId) {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map(mapOrder);
  },

  async listOrdersByEvent(eventId) {
    const docs = await OrderModel.find({ eventId }).sort({ createdAt: -1 }).exec();
    return docs.map(mapOrder);
  },

  async createPayment(payload) {
    const created = await PaymentModel.create(payload);
    return mapPayment(created);
  },

  async listPaymentsByOrder(orderId) {
    const docs = await PaymentModel.find({ orderId }).sort({ createdAt: -1 }).exec();
    return docs.map(mapPayment);
  },

  async createOrUpdateReview(payload) {
    const doc = await ReviewModel.findOneAndUpdate(
      { userId: payload.userId, eventId: payload.eventId },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    return mapReview(doc);
  },

  async listReviewsByEvent(eventId) {
    const docs = await ReviewModel.find({ eventId }).sort({ createdAt: -1 }).exec();
    return docs.map(mapReview);
  }
};
