import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Barber } from '../../enterprise/entities/barber';
import { BarberRepository } from '../repository/barber-repository';
import { ClientRepository } from '../repository/client-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface GetBarberNearbyUseCaseRequest {
  clientId: string;
}

type GetBarberNearbyUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    barbers: Barber[];
  }
>;

export class GetBarberNearbyUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private barberRepository: BarberRepository
  ) {}

  async execute({
    clientId,
  }: GetBarberNearbyUseCaseRequest): Promise<GetBarberNearbyUseCaseResponse> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const barbers = await this.barberRepository.findManyNearby({
      latitude: client.latitude,
      longitude: client.longitude,
    });

    return right({
      barbers,
    });
  }
}
