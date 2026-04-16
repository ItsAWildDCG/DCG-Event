import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createEventsRouter(eventsService, requireAuth, requireAdmin) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const events = await eventsService.listEvents(req.query);
      res.json(events);
    })
  );

  router.post(
    '/',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const event = await eventsService.createEvent(req.body, req.user.id);
      res.status(201).json(event);
    })
  );

  router.get(
    '/:eventId',
    asyncHandler(async (req, res) => {
      const event = await eventsService.getEventById(req.params.eventId);
      res.json(event);
    })
  );

  router.put(
    '/:eventId',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const event = await eventsService.updateEvent(req.params.eventId, req.body);
      res.json(event);
    })
  );

  router.delete(
    '/:eventId',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      await eventsService.deleteEvent(req.params.eventId);
      res.status(204).send();
    })
  );

  router.post(
    '/:eventId/register',
    requireAuth,
    asyncHandler(async (req, res) => {
      const reg = await eventsService.registerForEvent(req.params.eventId, req.user.id);
      res.status(201).json(reg);
    })
  );

  router.get(
    '/:eventId/registrations',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const regs = await eventsService.listRegistrationsForEvent(req.params.eventId);
      res.json(regs);
    })
  );

  return router;
}
