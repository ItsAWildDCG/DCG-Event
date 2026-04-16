import { ApiError } from '../utils/apiError.js';

export function createEventsService(eventsRepository) {
  async function listEvents(options = {}) {
    return eventsRepository.listEvents(options);
  }

  async function createEvent(payload, userId) {
    if (!payload.title || !payload.date || !payload.capacity) {
      throw new ApiError(400, 'title, date, capacity are required');
    }

    const capacity = Number(payload.capacity);
    if (Number.isNaN(capacity) || capacity < 1) {
      throw new ApiError(400, 'capacity must be a positive number');
    }

    return eventsRepository.createEvent({
      title: payload.title,
      description: payload.description || '',
      location: payload.location || '',
      date: payload.date,
      capacity,
      createdBy: userId,
      organizerId: payload.organizerId || userId,
      categoryIds: Array.isArray(payload.categoryIds) ? payload.categoryIds : [],
      venueIds: Array.isArray(payload.venueIds) ? payload.venueIds : []
    });
  }

  async function getEventById(id) {
    const event = await eventsRepository.getEventById(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    return event;
  }

  async function updateEvent(id, updates) {
    if (updates.capacity !== undefined) {
      const cap = Number(updates.capacity);
      if (Number.isNaN(cap) || cap < 1) {
        throw new ApiError(400, 'capacity must be a positive number');
      }
      updates.capacity = cap;
    }

    const updated = await eventsRepository.updateEvent(id, updates);
    if (!updated) {
      throw new ApiError(404, 'Event not found');
    }

    return updated;
  }

  async function deleteEvent(id) {
    const deleted = await eventsRepository.deleteEvent(id);
    if (!deleted) {
      throw new ApiError(404, 'Event not found');
    }
  }

  async function registerForEvent(eventId, userId) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const registrations = await eventsRepository.listRegistrationsForEvent(eventId);
    const already = registrations.find((r) => r.userId === userId);
    if (already) {
      return already;
    }

    if (registrations.length >= Number(event.capacity)) {
      throw new ApiError(409, 'Event is full');
    }

    return eventsRepository.registerForEvent(eventId, userId);
  }

  async function listRegistrationsForEvent(eventId) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    return eventsRepository.listRegistrationsForEvent(eventId);
  }

  return {
    listEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    listRegistrationsForEvent
  };
}
