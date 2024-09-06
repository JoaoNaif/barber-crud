import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Barber } from '../../enterprise/entities/barber';
import { BarberRepository } from '../repository/barber-repository';
import { ClientFavoritesRepository } from '../repository/client-favorites-repository';
import { ClientRepository } from '../repository/client-repository';

interface FetchClientFavoritesUseCaseRequest {
  id: string;
}

type FetchClientFavoritesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    barbers: Barber[];
  }
>;

export class FetchClientFavoritesUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private clientRepository: ClientRepository,
    private clientFavoritesRepository: ClientFavoritesRepository
  ) {}

  async execute({
    id,
  }: FetchClientFavoritesUseCaseRequest): Promise<FetchClientFavoritesUseCaseResponse> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const currentClientFavorites =
      await this.clientFavoritesRepository.findManyByClientId(id);

    const favoriteIds = currentClientFavorites.map((i) =>
      i.favoriteId.toString()
    );

    const barbers = await this.barberRepository.findManyFavorites(favoriteIds);

    return right({
      barbers,
    });
  }
}
