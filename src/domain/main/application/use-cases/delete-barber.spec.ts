import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeBarber } from 'test/factories/make-barber';
import { DeleteBarberUseCase } from './delete-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';

let inMemoryBarberRepository: InMemoryBarberRepository;
let sut: DeleteBarberUseCase;

describe('Delete Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    sut = new DeleteBarberUseCase(inMemoryBarberRepository);
  });

  it('should be able to delete a barber', async () => {
    const barber = makeBarber(
      {
        name: 'John Doe',
        password: '123456-hashed',
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    await sut.execute({
      barberId: 'barber-1',
    });

    expect(inMemoryBarberRepository.items).toHaveLength(0);
  });
});
