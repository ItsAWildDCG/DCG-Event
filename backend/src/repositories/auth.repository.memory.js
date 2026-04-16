import { memoryStore } from './memoryStore.js';

export const authRepositoryMemory = {
  async createUser(user) {
    const created = {
      id: memoryStore.makeId(),
      ...user,
      role: user.role || 'user',
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(created);
    return created;
  },

  async findUserByEmail(email) {
    return memoryStore.users.find((u) => u.email === email) || null;
  },

  async findUserById(id) {
    return memoryStore.users.find((u) => u.id === id) || null;
  },

  async updateUserProfile(id, updates) {
    const user = memoryStore.users.find((u) => u.id === id);
    if (!user) {
      return null;
    }

    user.name = updates.name;
    user.email = updates.email;
    return user;
  },

  async updateUserPassword(id, passwordHash) {
    const user = memoryStore.users.find((u) => u.id === id);
    if (!user) {
      return null;
    }

    user.passwordHash = passwordHash;
    return user;
  }
};
