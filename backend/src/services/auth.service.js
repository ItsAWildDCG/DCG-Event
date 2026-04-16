import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export function createAuthService(authRepository, eventsRepository) {
  function signToken(user) {
    return jwt.sign({ sub: user.id, email: user.email, role: user.role || 'user' }, env.jwtSecret, {
      expiresIn: '7d'
    });
  }

  async function register({ name, email, password }) {
    const existing = await authRepository.findUserByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser({ name, email, passwordHash, role: 'user' });

    return {
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    };
  }

  async function login({ email, password }) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return {
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    };
  }

  async function me(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };
  }

  async function updateProfile(userId, { name, email }) {
    const current = await authRepository.findUserById(userId);
    if (!current) {
      throw new ApiError(404, 'User not found');
    }

    if (email !== current.email) {
      const existing = await authRepository.findUserByEmail(email);
      if (existing && existing.id !== userId) {
        throw new ApiError(409, 'Email already in use');
      }
    }

    const updated = await authRepository.updateUserProfile(userId, { name, email });
    if (!updated) {
      throw new ApiError(404, 'User not found');
    }

    return {
      token: signToken(updated),
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role || 'user'
      }
    };
  }

  async function changePassword(userId, { currentPassword, newPassword }) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await authRepository.updateUserPassword(userId, passwordHash);

    return {
      token: signToken(updated),
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role || 'user'
      }
    };
  }

  async function myRegistrations(userId) {
    const registrations = await eventsRepository.listRegistrationsForUser(userId);
    const events = await eventsRepository.listEvents();
    const eventMap = new Map(events.map((event) => [event.id, event]));

    return registrations
      .map((registration) => {
        const event = eventMap.get(registration.eventId);
        if (!event) {
          return null;
        }

        return {
          registrationId: registration.id,
          registeredAt: registration.createdAt,
          ...event
        };
      })
      .filter(Boolean);
  }

  return {
    register,
    login,
    me,
    updateProfile,
    changePassword,
    myRegistrations
  };
}
