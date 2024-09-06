import { describe, beforeEach, it, expect } from 'vitest';
import { makeClient } from 'test/factories/make-client';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { makeClientFavorites } from 'test/factories/make-client-favorites';
import { DeleteClientUseCase } from './delete-client';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let sut: DeleteClientUseCase;

describe('Delete Client', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    sut = new DeleteClientUseCase(inMemoryClientRepository);
  });

  it('should be able to edit a client', async () => {
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
    });

    expect(inMemoryClientRepository.items).toHaveLength(0);
    expect(inMemoryClientFavoritesRepository.items).toHaveLength(0);
  });
});
