import { UniqueEntityId } from '../../src/core/entities/unique-entity-id';
import {
  Order,
  OrderProps,
} from '../../src/domain/main/enterprise/entities/order';
import { faker } from '@faker-js/faker';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  const order = Order.create(
    {
      barberId: new UniqueEntityId(),
      clientId: new UniqueEntityId(),
      beard: true,
      hair: true,
      eyebrow: true,
      price: 30,
      difficulty: 'intermediary',
      status: faker.lorem.sentence(),
      ...override,
    },
    id
  );

  return order;
}
