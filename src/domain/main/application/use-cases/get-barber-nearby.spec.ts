import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeBarber } from 'test/factories/make-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { GetBarberNearbyUseCase } from './get-barber-nearby';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { makeClient } from 'test/factories/make-client';

let inMemoryBarberRepository: InMemoryBarberRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let sut: GetBarberNearbyUseCase;

describe('Get Barber Metrics', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    sut = new GetBarberNearbyUseCase(
      inMemoryClientRepository,
      inMemoryBarberRepository
    );
  });

  it('should be able to fetch nearby barber', async () => {
    const near = makeBarber({
      name: 'John Near',
      latitude: -23.5591942,
      longitude: -46.5836981,
    });

    await inMemoryBarberRepository.create(near);

    const far = makeBarber({
      name: 'John Far',
      latitude: -21.163709,
      longitude: -47.813523,
    });

    await inMemoryBarberRepository.create(far);

    const client = makeClient(
      {
        latitude: -23.5591942,
        longitude: -46.5836981,
      },
      new UniqueEntityId('client-1')
    );

    await inMemoryClientRepository.create(client);

    const result = await sut.execute({
      clientId: 'client-1',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const barbers = result.value.barbers;
      expect(barbers).toEqual([expect.objectContaining({ name: 'John Near' })]);
    }
  });
});
