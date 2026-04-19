import { UserModel } from '../models/User.js';

function formatDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

async function nextNumericId(model) {
  const [result] = await model.aggregate([{ $group: { _id: null, maxId: { $max: '$_id' } } }]);
  return Number((result?.maxId || 0) + 1);
}

function toNumericId(id) {
  const parsed = Number(id);
  return Number.isFinite(parsed) ? parsed : id;
}

function mapUser(doc) {
  if (!doc) {
    return null;
  }

  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.password || doc.passwordHash || '',
    phone: doc.phone || '',
    role: doc.role || 'user',
    createdAt: formatDate(doc.createdAt || doc.created_at)
  };
}

export const authRepositoryMongo = {
  async createUser(user) {
    const created = await UserModel.create({
      _id: await nextNumericId(UserModel),
      name: user.name,
      email: user.email,
      password: user.passwordHash || user.password,
      phone: user.phone || '',
      role: user.role || 'user',
      created_at: formatDate(new Date())
    });
    return mapUser(created);
  },

  async findUserByEmail(email) {
    const doc = await UserModel.findOne({ email }).lean().exec();
    return mapUser(doc);
  },

  async findUserById(id) {
    const doc = await UserModel.findById(toNumericId(id)).lean().exec();
    return mapUser(doc);
  },

  async updateUserProfile(id, updates) {
    const doc = await UserModel.findByIdAndUpdate(
      toNumericId(id),
      { name: updates.name, email: updates.email },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    return mapUser(doc);
  },

  async updateUserPassword(id, passwordHash) {
    const doc = await UserModel.findByIdAndUpdate(
      toNumericId(id),
      { password: passwordHash },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    return mapUser(doc);
  },

  async listUsers() {
    const docs = await UserModel.find({}).sort({ _id: -1 }).lean().exec();
    return docs.map(mapUser);
  },

  async updateUserRole(id, role) {
    const doc = await UserModel.findByIdAndUpdate(
      toNumericId(id),
      { role },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    return mapUser(doc);
  }
};
