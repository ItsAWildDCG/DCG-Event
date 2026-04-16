import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Missing bearer token'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role || 'user'
    };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }

  next();
}

export function requireOrganizerOrAdmin(req, res, next) {
  if (!req.user || !['organizer', 'admin'].includes(req.user.role)) {
    return next(new ApiError(403, 'Organizer or admin access required'));
  }

  next();
}
