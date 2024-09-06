import { describe, beforeEach, it, expect, MockInstance, vi } from 'vitest';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notificartion-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { makeClient } from 'test/factories/make-client';
import { makeOrder } from 'test/factories/make-order';
import { waitFor } from 'test/utils/wait-for';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { OnOrderUpdated } from './on-order-updated';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Order Update', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnOrderUpdated(inMemoryClientRepository, sendNotificationUseCase);
  });

  it('should  send a notification when an order is updated', async () => {
    const client = makeClient();
    const order = makeOrder({ clientId: client.id });

    inMemoryClientRepository.create(client);
    inMemoryOrderRepository.create(order);

    order.status = 'test notification status';

    inMemoryOrderRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
