import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';

interface GetBarberMetricsUseCaseRequest {
  barberId: string;
}

type GetBarberMetricsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    history: number;
    stars: number;
  }
>;

export class GetBarberMetricsUseCase {
  constructor(private barberRepository: BarberRepository) {}

  async execute({
    barberId,
  }: GetBarberMetricsUseCaseRequest): Promise<GetBarberMetricsUseCaseResponse> {
    const barber = await this.barberRepository.findById(barberId);

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const history = barber.metrics;
    const stars = barber.stars;

    return right({
      history,
      stars,
    });
  }
}
