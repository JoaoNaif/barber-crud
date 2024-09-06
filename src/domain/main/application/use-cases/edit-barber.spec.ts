import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeBarber } from 'test/factories/make-barber';
import { EditBarberUseCase } from './edit-barber';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryBarberRepository: InMemoryBarberRepository;
let fakeHasher: FakeHasher;
let sut: EditBarberUseCase;

describe('Update Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    fakeHasher = new FakeHasher();
    sut = new EditBarberUseCase(inMemoryBarberRepository, fakeHasher);
  });

  it('should be able to edit a barber', async () => {
    const barber = makeBarber({
      name: 'John Doe',
      password: '123456-hashed',
    });

    await inMemoryBarberRepository.create(barber);

    await sut.execute({
      id: barber.id.toString(),
      name: 'Fulano',
      newPassword: '654321',
      oldPassword: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    });

    expect(inMemoryBarberRepository.items[0]).toMatchObject({
      name: 'Fulano',
      password: '654321-hashed',
      latitude: -23.623352,
      longitude: -46.558612,
    });
  });

  it('should not be able to edit with a wrong password', async () => {
    const barber = makeBarber({
      name: 'John Doe',
      password: '123456-hashed',
    });

    await inMemoryBarberRepository.create(barber);

    const result = await sut.execute({
      id: barber.id.toString(),
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
