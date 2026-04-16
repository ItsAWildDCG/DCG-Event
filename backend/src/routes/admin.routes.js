import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createAdminRouter(authService, requireAuth, requireAdmin) {
  const router = Router();

  router.get(
    '/users',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const users = await authService.listUsers();
      res.json(users);
    })
  );

  router.put(
    '/users/:userId/role',
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const user = await authService.updateUserRole(req.params.userId, req.body.role);
      res.json(user);
    })
  );

  return router;
}
