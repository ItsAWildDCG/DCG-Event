import { UserModel } from '../models/User.js';

function mapUser(doc) {
  if (!doc) {
    return null;
  }

  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role || 'user',
    createdAt: doc.createdAt.toISOString()
  };
}

export const authRepositoryMongo = {
  async createUser(user) {
    const created = await UserModel.create(user);
    return mapUser(created);
  },

  async findUserByEmail(email) {
    const doc = await UserModel.findOne({ email }).exec();
    return mapUser(doc);
  },

  async findUserById(id) {
    const doc = await UserModel.findById(id).exec();
    return mapUser(doc);
  },

  async updateUserProfile(id, updates) {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { name: updates.name, email: updates.email },
      { new: true, runValidators: true }
    ).exec();

    return mapUser(doc);
  },

  async updateUserPassword(id, passwordHash) {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { passwordHash },
      { new: true, runValidators: true }
    ).exec();

    return mapUser(doc);
  },

  async listUsers() {
    const docs = await UserModel.find({}).sort({ createdAt: -1 }).exec();
    return docs.map(mapUser);
  },

  async updateUserRole(id, role) {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).exec();

    return mapUser(doc);
  }
};
