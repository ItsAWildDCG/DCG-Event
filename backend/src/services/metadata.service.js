import { ApiError } from '../utils/apiError.js';

export function createMetadataService(domainRepository) {
  async function listCategories() {
    return domainRepository.listCategories();
  }

  async function createCategory(payload) {
    if (!payload.name) {
      throw new ApiError(400, 'name is required');
    }

    return domainRepository.createCategory({ name: payload.name });
  }

  async function listVenues() {
    return domainRepository.listVenues();
  }

  async function createVenue(payload) {
    if (!payload.name || !payload.city || payload.capacity === undefined) {
      throw new ApiError(400, 'name, city, capacity are required');
    }

    const capacity = Number(payload.capacity);
    if (Number.isNaN(capacity) || capacity < 1) {
      throw new ApiError(400, 'capacity must be a positive number');
    }

    return domainRepository.createVenue({
      name: payload.name,
      address: payload.address || '',
      city: payload.city,
      capacity
    });
  }

  return {
    listCategories,
    createCategory,
    listVenues,
    createVenue
  };
}
