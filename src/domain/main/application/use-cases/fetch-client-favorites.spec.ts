import { describe, beforeEach, it, expect } from 'vitest';
import { makeClient } from 'test/factories/make-client';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { FetchClientFavoritesUseCase } from './fetch-client-favorites';
import { makeClientFavorites } from 'test/factories/make-client-favorites';
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { makeBarber } from 'test/factories/make-barber';
import { ClientFavoriteList } from '../../enterprise/entities/client-favorite-list';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryBarberRepository: InMemoryBarberRepository;
let sut: FetchClientFavoritesUseCase;

describe('Fetch Client Favorites', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    inMemoryBarberRepository = new InMemoryBarberRepository();
    sut = new FetchClientFavoritesUseCase(
      inMemoryBarberRepository,
      inMemoryClientRepository,
      inMemoryClientFavoritesRepository
    );
  });

  it('should be able to search a list of favorites', async () => {
    const client = makeClient({
      name: 'John Doe',
    });

    await inMemoryClientRepository.create(client);

    const barber1 = makeBarber(
      {
        name: 'barber doe',
      },
      new UniqueEntityId('barber-1')
    );

    const barber2 = makeBarber(
      {
        name: 'barber doe',
      },
      new UniqueEntityId('barber-2')
    );

    await inMemoryBarberRepository.create(barber1);
    await inMemoryBarberRepository.create(barber2);

    const clientFavorite1 = makeClientFavorites({
      clientId: client.id,
      favoriteId: barber1.id,
    });

    const clientFavorite2 = makeClientFavorites({
      clientId: client.id,
      favoriteId: barber2.id,
    });

    const favorites = [clientFavorite1, clientFavorite2];

    await inMemoryClientFavoritesRepository.createMany(favorites);

    client.favorites = new ClientFavoriteList(favorites);

    await inMemoryClientRepository.save(client);

    const result = await sut.execute({
      id: client.id.toString(),
    });

    expect(result.value).toEqual({
      barbers: expect.arrayContaining([barber1, barber2]),
    });
  });
});
