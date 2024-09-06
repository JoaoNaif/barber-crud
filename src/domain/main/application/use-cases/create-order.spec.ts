import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { makeBarber } from 'test/factories/make-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { makeClient } from 'test/factories/make-client';

let inMemoryBarberRepository: InMemoryBarberRepository;
let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryBarberRepository = new InMemoryBarberRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    inMemoryOrderRepository = new InMemoryOrderRepository();
    sut = new CreateOrderUseCase(
      inMemoryBarberRepository,
      inMemoryClientRepository,
      inMemoryOrderRepository
    );
  });

  it('should be able to create a new order', async () => {
    const barber = makeBarber(
      {
        name: 'John Barber',
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    const client = makeClient(
      {
        name: 'John Client',
      },
      new UniqueEntityId('client-1')
    );

    await inMemoryClientRepository.create(client);

    const result = await sut.execute({
      clientId: client.id.toString(),
      barberId: barber.id.toString(),
      hair: true,
      eyebrow: false,
      beard: true,
      difficulty: 'intermediary',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrderRepository.items).toHaveLength(1);
  });
});
