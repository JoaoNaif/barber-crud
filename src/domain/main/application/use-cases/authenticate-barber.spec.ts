import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateBarberUseCase } from './authenticate-barber';
import { makeBarber } from 'test/factories/make-barber';

let inMemoryBarberRepository: InMemoryBarberRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateBarberUseCase;

describe('Authenticate Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateBarberUseCase(
      inMemoryBarberRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it('should be able to authenticate a barber', async () => {
    const barber = makeBarber({
      password: await fakeHasher.hash('123456'),
    });

    inMemoryBarberRepository.create(barber);

    const result = await sut.execute({
      cpf: barber.cpf.value,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
