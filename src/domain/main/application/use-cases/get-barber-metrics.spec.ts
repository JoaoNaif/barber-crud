import { InMemoryBarberRepository } from 'test/repositories/in-memory-barber-repository';
import { describe, beforeEach, it, expect } from 'vitest';
import { makeBarber } from 'test/factories/make-barber';
import { GetBarberMetricsUseCase } from './get-barber-metrics';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';

let inMemoryBarberRepository: InMemoryBarberRepository;
let sut: GetBarberMetricsUseCase;

describe('Get Barber Metrics', () => {
  beforeEach(() => {
    inMemoryBarberRepository = new InMemoryBarberRepository();
    sut = new GetBarberMetricsUseCase(inMemoryBarberRepository);
  });

  it('should be able to get history and stars of a barber', async () => {
    const barber = makeBarber(
      {
        name: 'John Doe',
        password: '123456-hashed',
        metrics: 10,
        stars: 4.3,
      },
      new UniqueEntityId('barber-1')
    );

    await inMemoryBarberRepository.create(barber);

    const result = await sut.execute({
      barberId: 'barber-1',
    });

    expect(result.value).toMatchObject({
      history: 10,
      stars: 4.3,
    });
  });
});
