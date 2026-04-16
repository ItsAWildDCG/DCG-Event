import { ApiError } from '../utils/apiError.js';

export function validateUpdateProfilePayload(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ApiError(400, 'name and email are required'));
  }

  next();
}

export function validateChangePasswordPayload(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ApiError(400, 'currentPassword and newPassword are required'));
  }

  if (String(newPassword).length < 6) {
    return next(new ApiError(400, 'newPassword must be at least 6 characters'));
  }

  next();
}
