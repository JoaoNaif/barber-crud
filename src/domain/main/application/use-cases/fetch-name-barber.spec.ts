import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeBarber } from 'test/factories/make-barber';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { FetchNameBarberUseCase } from './fetch-name-barber';

let inMemoryBarberRepository: InMemoryBarberRepository;
let sut: FetchNameBarberUseCase;

describe('Fetch Name Barber', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    sut = new FetchNameBarberUseCase(inMemoryBarberRepository);
  });

  it('should be able to fetch barber for name', async () => {
    await inMemoryBarberRepository.create(
      makeBarber(
        {
          name: 'John Doe',
        },
        new UniqueEntityId('barber-1')
      )
    );

    await inMemoryBarberRepository.create(
      makeBarber(
        {
          name: 'John Joe',
        },
        new UniqueEntityId('barber-2')
      )
    );

    await inMemoryBarberRepository.create(
      makeBarber(
        {
          name: 'Fulano',
        },
        new UniqueEntityId('barber-2')
      )
    );

    const result = await sut.execute({
      name: 'John Doe',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const barbers = result.value.barbers;

      expect(barbers).toHaveLength(1);
    }
  });

  it('should be able to fetch paginated babers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryBarberRepository.create(
        makeBarber({
          name: `barber-${i}`,
        })
      );
    }

    const result = await sut.execute({
      name: 'barber',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const barbers = result.value.barbers;

      expect(barbers).toHaveLength(2);
    }
  });
});
