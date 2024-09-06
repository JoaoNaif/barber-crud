import { describe, beforeEach, it, expect } from 'vitest';
import { CancelOrderUseCase } from './cancel-order';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeClient } from 'test/factories/make-client';
import { makeOrder } from 'test/factories/make-order';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let sut: CancelOrderUseCase;

describe('Cancel Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    sut = new CancelOrderUseCase(
      inMemoryClientRepository,
      inMemoryOrderRepository
    );
  });

  it('should be able to delete a barber', async () => {
    const client = makeClient();

    await inMemoryClientRepository.create(client);

    const order = makeOrder({
      clientId: client.id,
    });

    await sut.execute({
      clientId: client.id.toString(),
      orderId: order.id.toString(),
    });

    expect(inMemoryOrderRepository.items).toHaveLength(0);
  });
});
