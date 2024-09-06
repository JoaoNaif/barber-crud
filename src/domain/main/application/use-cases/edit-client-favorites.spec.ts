import { describe, beforeEach, it, expect } from 'vitest';
import { makeClient } from 'test/factories/make-client';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { EditClientFavoritesUseCase } from './edit-client-favorites';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { makeClientFavorites } from 'test/factories/make-client-favorites';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let sut: EditClientFavoritesUseCase;

describe('Update Client Favorites', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    sut = new EditClientFavoritesUseCase(
      inMemoryClientRepository,
      inMemoryClientFavoritesRepository
    );
  });

  it('should be able to edit a client favorites', async () => {
    const client = makeClient(
      {
        name: 'John Doe',
        password: '123456-hashed',
      },
      new UniqueEntityId('client-1')
    );

    await inMemoryClientRepository.create(client);

    inMemoryClientFavoritesRepository.items.push(
      makeClientFavorites({
        clientId: client.id,
        favoriteId: new UniqueEntityId('1'),
      }),
      makeClientFavorites({
        clientId: client.id,
        favoriteId: new UniqueEntityId('2'),
      })
    );

    await sut.execute({
      id: client.id.toValue(),
      favoriteIds: ['1', '3'],
    });

    expect(
      inMemoryClientRepository.items[0].favorites.currentItems
    ).toHaveLength(2);
    expect(inMemoryClientRepository.items[0].favorites.currentItems).toEqual([
      expect.objectContaining({ favoriteId: new UniqueEntityId('1') }),
      expect.objectContaining({ favoriteId: new UniqueEntityId('3') }),
    ]);
  });

  it('should sync new and removed favorite when editing a client', async () => {
    const client = makeClient(
      {
        name: 'John Doe',
        password: '123456-hashed',
      },
      new UniqueEntityId('client-1')
    );

    await inMemoryClientRepository.create(client);

    inMemoryClientFavoritesRepository.items.push(
      makeClientFavorites({
        clientId: client.id,
        favoriteId: new UniqueEntityId('1'),
      }),
      makeClientFavorites({
        clientId: client.id,
        favoriteId: new UniqueEntityId('2'),
      })
    );

    const result = await sut.execute({
      id: client.id.toValue(),
      favoriteIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientFavoritesRepository.items).toHaveLength(2);
    expect(inMemoryClientFavoritesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          favoriteId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          favoriteId: new UniqueEntityId('3'),
        }),
      ])
    );
  });
});
