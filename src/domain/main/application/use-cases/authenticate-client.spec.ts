import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateClientUseCase } from './authenticate-client';
import { makeClient } from 'test/factories/make-client';
import { InMemoryClientFavoritesRepository } from 'test/repositories/in-memory-client-favorites-repository';

let inMemoryClientFavoritesRepository: InMemoryClientFavoritesRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateClientUseCase;

describe('Authenticate Client', () => {
  beforeEach(() => {
    inMemoryClientFavoritesRepository = new InMemoryClientFavoritesRepository();
    inMemoryClientRepository = new InMemoryClientRepository(
      inMemoryClientFavoritesRepository
    );
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateClientUseCase(
      inMemoryClientRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      password: await fakeHasher.hash('123456'),
    });

    inMemoryClientRepository.create(client);

    const result = await sut.execute({
      email: client.email,
      password: '123456',
    });

    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
