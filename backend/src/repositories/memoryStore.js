import crypto from 'crypto';

function makeId() {
  return crypto.randomUUID();
}

export const memoryStore = {
  users: [],
  events: [],
  registrations: [],
  categories: [],
  venues: [],
  tickets: [],
  orders: [],
  payments: [],
  reviews: [],
  makeId
};
