import { env } from '../config/env.js';
import { authRepositoryMemory } from './auth.repository.memory.js';
import { eventsRepositoryMemory } from './events.repository.memory.js';
import { domainRepositoryMemory } from './domain.repository.memory.js';
import { authRepositoryMongo } from './auth.repository.mongo.js';
import { eventsRepositoryMongo } from './events.repository.mongo.js';
import { domainRepositoryMongo } from './domain.repository.mongo.js';

export function getRepositories() {
  if (env.storageMode === 'mongo') {
    return {
      authRepository: authRepositoryMongo,
      eventsRepository: eventsRepositoryMongo,
      domainRepository: domainRepositoryMongo
    };
  }

  return {
    authRepository: authRepositoryMemory,
    eventsRepository: eventsRepositoryMemory,
    domainRepository: domainRepositoryMemory
  };
}
