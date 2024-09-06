import { Either, right } from '../../../../core/either';
import { Barber } from '../../enterprise/entities/barber';
import { BarberRepository } from '../repository/barber-repository';

interface FetchNameBarberUseCaseRequest {
  name: string;
  page: number;
}

type FetchNameBarberUseCaseResponse = Either<
  null,
  {
    barbers: Barber[];
  }
>;

export class FetchNameBarberUseCase {
  constructor(private barberRepository: BarberRepository) {}

  async execute({
    name,
    page,
  }: FetchNameBarberUseCaseRequest): Promise<FetchNameBarberUseCaseResponse> {
    const barbers = await this.barberRepository.findManyNameBarber(name, page);

    return right({
      barbers,
    });
  }
}
