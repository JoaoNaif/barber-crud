import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Client,
  ClientProps,
} from '../../src/domain/main/enterprise/entities/client';
import { faker } from '@faker-js/faker';

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityId
) {
  const client = Client.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id
  );

  return client;
}
