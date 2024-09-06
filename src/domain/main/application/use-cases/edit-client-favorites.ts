import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Client } from '../../enterprise/entities/client';
import { ClientFavorite } from '../../enterprise/entities/client-favorite';
import { ClientFavoriteList } from '../../enterprise/entities/client-favorite-list';
import { ClientFavoritesRepository } from '../repository/client-favorites-repository';
import { ClientRepository } from '../repository/client-repository';

interface EditClientFavoritesUseCaseRequest {
  id: string;
  favoriteIds: string[];
}

type EditClientFavoritesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    client: Client;
  }
>;

export class EditClientFavoritesUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private clientFavoritesRepository: ClientFavoritesRepository
  ) {}

  async execute({
    id,
    favoriteIds,
  }: EditClientFavoritesUseCaseRequest): Promise<EditClientFavoritesUseCaseResponse> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const currentClientFavorites =
      await this.clientFavoritesRepository.findManyByClientId(id);

    const clientFavoriteList = new ClientFavoriteList(currentClientFavorites);

    const clientFavorites = favoriteIds.map((favoriteId) => {
      return ClientFavorite.create({
        favoriteId: new UniqueEntityId(favoriteId),
        clientId: client.id,
      });
    });

    clientFavoriteList.update(clientFavorites);

    client.favorites = clientFavoriteList;

    await this.clientRepository.save(client);

    return right({
      client,
    });
  }
}
