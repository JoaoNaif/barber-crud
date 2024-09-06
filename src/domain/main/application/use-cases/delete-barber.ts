import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';

interface DeleteBarberUseCaseRequest {
  barberId: string;
}

type DeleteBarberUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteBarberUseCase {
  constructor(private barberRepository: BarberRepository) {}

  async execute({
    barberId,
  }: DeleteBarberUseCaseRequest): Promise<DeleteBarberUseCaseResponse> {
    const barber = await this.barberRepository.findById(barberId);

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    await this.barberRepository.delete(barber);

    return right(null);
  }
}
