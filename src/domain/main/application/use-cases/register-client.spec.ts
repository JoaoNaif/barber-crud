import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { RegisterClientUseCase } from './register-client';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { describe, beforeEach, it, expect } from 'vitest';

let fakeHasher: FakeHasher;
let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let sut: RegisterClientUseCase;

describe('Create Barber', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    fakeHasher = new FakeHasher();
    sut = new RegisterClientUseCase(inMemoryClientRepository, fakeHasher);
  });

  it('should be able to register a new barber', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      favoriteIds: ['1', '2'],
      latitude: -23.623352,
      longitude: -46.558612,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const client = result.value.client;
      expect(inMemoryClientRepository.items[0]).toEqual(client);
    }
  });

  it('should hash barber password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      favoriteIds: ['1', '2'],
      latitude: -23.623352,
      longitude: -46.558612,
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryClientRepository.items[0].password).toEqual(hashedPassword);
  });
});
