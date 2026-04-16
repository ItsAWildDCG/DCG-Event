import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  validateRegisterPayload,
  validateLoginPayload
} from '../middleware/validateAuthPayload.js';
import {
  validateUpdateProfilePayload,
  validateChangePasswordPayload
} from '../middleware/validateAccountPayload.js';

export function createAuthRouter(authService, requireAuth) {
  const router = Router();

  router.post(
    '/register',
    validateRegisterPayload,
    asyncHandler(async (req, res) => {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      res.status(201).json(result);
    })
  );

  router.post(
    '/login',
    validateLoginPayload,
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json(result);
    })
  );

  router.get(
    '/me',
    requireAuth,
    asyncHandler(async (req, res) => {
      const me = await authService.me(req.user.id);
      res.json(me);
    })
  );

  router.put(
    '/me',
    requireAuth,
    validateUpdateProfilePayload,
    asyncHandler(async (req, res) => {
      const result = await authService.updateProfile(req.user.id, req.body);
      res.json(result);
    })
  );

  router.put(
    '/me/password',
    requireAuth,
    validateChangePasswordPayload,
    asyncHandler(async (req, res) => {
      const result = await authService.changePassword(req.user.id, req.body);
      res.json(result);
    })
  );

  router.get(
    '/me/registrations',
    requireAuth,
    asyncHandler(async (req, res) => {
      const registrations = await authService.myRegistrations(req.user.id);
      res.json(registrations);
    })
  );

  return router;
}
