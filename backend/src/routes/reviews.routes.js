import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createReviewsRouter(reviewsService, requireAuth) {
  const router = Router();

  router.get(
    '/events/:eventId/reviews',
    asyncHandler(async (req, res) => {
      const reviews = await reviewsService.listReviewsByEvent(req.params.eventId);
      res.json(reviews);
    })
  );

  router.post(
    '/events/:eventId/reviews',
    requireAuth,
    asyncHandler(async (req, res) => {
      const review = await reviewsService.addReview(req.user.id, req.params.eventId, req.body);
      res.status(201).json(review);
    })
  );

  return router;
}
