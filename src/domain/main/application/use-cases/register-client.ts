import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Either, left, right } from '../../../../core/either';
import { Client } from '../../enterprise/entities/client';
import { ClientFavorite } from '../../enterprise/entities/client-favorite';
import { HashGenerator } from '../cryptography/hash-generator';
import { ClientRepository } from '../repository/client-repository';
import { ClientAlreadyExistsError } from './errors/client-already-exists-error';
import { ClientFavoriteList } from '../../enterprise/entities/client-favorite-list';

interface RegisterClientUseCaseRequest {
  name: string;
  email: string;
  password: string;
  favoriteIds: string[];
  latitude: number;
  longitude: number;
}

type RegisterClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client;
  }
>;
export class RegisterClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
    favoriteIds,
    latitude,
    longitude,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const sameEmail = await this.clientRepository.findByEmail(email);

    if (sameEmail) {
      return left(new ClientAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const client = Client.create({
      email,
      name,
      password: hashedPassword,
      latitude,
      longitude,
    });

    const clientFavorites = favoriteIds.map((favoriteId) => {
      return ClientFavorite.create({
        favoriteId: new UniqueEntityId(favoriteId),
        clientId: client.id,
      });
    });

    client.favorites = new ClientFavoriteList(clientFavorites);

    await this.clientRepository.create(client);

    return right({
      client,
    });
  }
}
