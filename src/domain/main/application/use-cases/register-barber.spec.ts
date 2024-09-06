import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { RegisterBarberUseCase } from './register-barber';
import { describe, beforeEach, it, expect } from 'vitest';

let inMemoryBarberRepository: InMemoryBarberRepository;
let fakeHasher: FakeHasher;
let sut: RegisterBarberUseCase;

describe('Create Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterBarberUseCase(inMemoryBarberRepository, fakeHasher);
  });

  it('should be able to register a new barber', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      barber: inMemoryBarberRepository.items[0],
    });
  });

  it('should hash barber password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryBarberRepository.items[0].password).toEqual(hashedPassword);
  });
});
