import { FakeHasher } from 'test/cryptography/fake-hasher';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeClient } from 'test/factories/make-client';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { EditClientUseCase } from './edit-client';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let fakeHasher: FakeHasher;
let sut: EditClientUseCase;

describe('Update Client', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    fakeHasher = new FakeHasher();
    sut = new EditClientUseCase(inMemoryClientRepository, fakeHasher);
  });

  it('should be able to edit a client', async () => {
    const client = makeClient({
      name: 'John Doe',
      password: '123456-hashed',
    });

    await inMemoryClientRepository.create(client);

    await sut.execute({
      id: client.id.toString(),
      name: 'Fulano',
      newPassword: '654321',
      oldPassword: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    });

    expect(inMemoryClientRepository.items[0]).toMatchObject({
      name: 'Fulano',
      password: '654321-hashed',
      latitude: -23.623352,
      longitude: -46.558612,
    });
  });

  it('should not be able to edit with a wrong password', async () => {
    const client = makeClient({
      name: 'John Doe',
      password: '123456-hashed',
    });

    await inMemoryClientRepository.create(client);

    const result = await sut.execute({
      id: client.id.toString(),
      name: 'Fulano',
      newPassword: '654321',
      oldPassword: '123458',
      latitude: -23.623352,
      longitude: -46.558612,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
