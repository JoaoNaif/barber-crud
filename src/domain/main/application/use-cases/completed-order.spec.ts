import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeBarber } from 'test/factories/make-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';
import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { CompletedOrderUseCase } from './completed-order';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryBarberRepository: InMemoryBarberRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let sut: CompletedOrderUseCase;

describe('Completed Order', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new CompletedOrderUseCase(
      inMemoryBarberRepository,
      inMemoryOrderRepository
    );
  });

  it('should be able to complete order', async () => {
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
      },
      new UniqueEntityId('order-1')
    );

    await inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      barberId: 'barber-1',
      orderId: 'order-1',
      stars: 4,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrderRepository.items[0].status).toEqual(
      `Pedido Finalizado`
    );
    expect(inMemoryBarberRepository.items[0].metrics).toEqual(1);
  });

  it('should be able to average stars', async () => {
    const barber = makeBarber(
      {
        name: 'John Barber',
        metrics: 2,
        stars: 8,
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    const order = makeOrder(
      {
        barberId: barber.id,
      },
      new UniqueEntityId('order-1')
    );

    await inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      barberId: 'barber-1',
      orderId: 'order-1',
      stars: 4,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryBarberRepository.items[0].stars).toEqual(4);
  });

  it('It shouldnt be possible to have stars greater than 5', async () => {
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
      },
      new UniqueEntityId('order-1')
    );

    await inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      barberId: 'barber-1',
      orderId: 'order-1',
      stars: 6,
    });

    expect(result.value).toBeInstanceOf(WrongCredentialsError);
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
      stars: 3,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
