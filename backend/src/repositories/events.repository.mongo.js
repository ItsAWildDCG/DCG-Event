import { EventModel } from '../models/Event.js';
import { RegistrationModel } from '../models/Registration.js';

function mapEvent(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    location: doc.location,
    date: doc.date,
    createdBy: doc.createdBy.toString(),
    organizerId: doc.organizerId ? doc.organizerId.toString() : null,
    approvalStatus: doc.approvalStatus || 'approved',
    approvedBy: doc.approvedBy ? doc.approvedBy.toString() : null,
    approvedAt: doc.approvedAt ? doc.approvedAt.toISOString() : null,
    categoryIds: (doc.categoryIds || []).map((id) => id.toString()),
    venueIds: (doc.venueIds || []).map((id) => id.toString()),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function mapRegistration(doc) {
  return {
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    userId: doc.userId.toString(),
    createdAt: doc.createdAt.toISOString()
  };
}

export const eventsRepositoryMongo = {
  async listEvents(options = {}) {
    const search = String(options.search || '').trim();
    const page = Math.max(1, Number(options.page || 1));
    const limit = Math.max(1, Number(options.limit || 0));
    const approvalStatus = options.approvalStatus;
    const organizerId = options.organizerId;

    const clauses = [];

    if (search) {
      clauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { date: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (approvalStatus === 'approved') {
      clauses.push({ $or: [{ approvalStatus: 'approved' }, { approvalStatus: { $exists: false } }] });
    } else if (approvalStatus) {
      clauses.push({ approvalStatus });
    }

    if (organizerId) {
      clauses.push({ organizerId });
    }

    const filter = clauses.length > 0 ? { $and: clauses } : {};

    if (!options.search && !options.page && !options.limit) {
      const docs = await EventModel.find(filter).sort({ date: 1 }).exec();
      return docs.map(mapEvent);
    }

    const totalItems = await EventModel.countDocuments(filter).exec();
    const effectiveLimit = limit || totalItems || 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / effectiveLimit));
    const currentPage = Math.min(page, totalPages);
    const docs = await EventModel.find(filter)
      .sort({ date: 1 })
      .skip((currentPage - 1) * effectiveLimit)
      .limit(effectiveLimit)
      .exec();

    return {
      items: docs.map(mapEvent),
      page: currentPage,
      totalPages,
      totalItems,
      limit: effectiveLimit
    };
  },

  async createEvent(payload) {
    const created = await EventModel.create(payload);
    return mapEvent(created);
  },

  async getEventById(id) {
    const doc = await EventModel.findById(id).exec();
    return doc ? mapEvent(doc) : null;
  },

  async updateEvent(id, updates) {
    const doc = await EventModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).exec();

    return doc ? mapEvent(doc) : null;
  },

  async deleteEvent(id) {
    const deleted = await EventModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      return false;
    }

    await RegistrationModel.deleteMany({ eventId: id }).exec();
    return true;
  },

  async registerForEvent(eventId, userId) {
    const doc = await RegistrationModel.findOneAndUpdate(
      { eventId, userId },
      { eventId, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    return mapRegistration(doc);
  },

  async listRegistrationsForEvent(eventId) {
    const docs = await RegistrationModel.find({ eventId }).exec();
    return docs.map(mapRegistration);
  },

  async listRegistrationsForUser(userId) {
    const docs = await RegistrationModel.find({ userId }).exec();
    return docs.map(mapRegistration);
  }
};
