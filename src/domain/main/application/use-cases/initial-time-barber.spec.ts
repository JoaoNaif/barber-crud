import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeBarber } from 'test/factories/make-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { InitialTimeBarberOrderUseCase } from './initial-time-barber';

let inMemoryBarberRepository: InMemoryBarberRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let sut: InitialTimeBarberOrderUseCase;

describe('Arrived Local Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new InitialTimeBarberOrderUseCase(
      inMemoryBarberRepository,
      inMemoryOrderRepository
    );
  });

  it('should be able to initial order time', async () => {
    const barber = makeBarber(
      {
        name: 'John Barber',
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    const order = makeOrder(
      {
        barberId: barber.id,
        difficulty: 'intermediary',
      },
      new UniqueEntityId('order-1')
    );

    await inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      barberId: 'barber-1',
      orderId: 'order-1',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should a barber be able to change only his orders', async () => {
    const barber = makeBarber(
      {
        name: 'John Barber',
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    const order = makeOrder(
      {
        barberId: new UniqueEntityId('barber-2'),
      },
      new UniqueEntityId('order-1')
    );

    await inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      barberId: 'barber-1',
      orderId: 'order-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
