import { describe, beforeEach, it, expect, MockInstance, vi } from 'vitest';
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notificartion-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnOrderCreated } from './on-order-created';
import { makeBarber } from 'test/factories/make-barber';
import { makeOrder } from 'test/factories/make-order';
import { waitFor } from 'test/utils/wait-for';

let inMemoryBarberRepository: InMemoryBarberRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Order Created', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnOrderCreated(inMemoryBarberRepository, sendNotificationUseCase);
  });

  it('should  send a notification when an order is created', async () => {
    const barber = makeBarber();
    const order = makeOrder({ barberId: barber.id });

    inMemoryBarberRepository.create(barber);
    inMemoryOrderRepository.create(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
