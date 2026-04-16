import { ApiError } from '../utils/apiError.js';

export function validateRegisterPayload(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, 'name, email, and password are required'));
  }
  if (String(password).length < 6) {
    return next(new ApiError(400, 'password must be at least 6 characters'));
  }
  next();
}

export function validateLoginPayload(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'email and password are required'));
  }
  next();
}
