import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Client } from '../../enterprise/entities/client';
import { HashGenerator } from '../cryptography/hash-generator';
import { ClientRepository } from '../repository/client-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditClientUseCaseRequest {
  id: string;
  name: string;
  newPassword: string;
  oldPassword: string;
  latitude: number;
  longitude: number;
}

type EditClientUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    client: Client;
  }
>;

export class EditClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    id,
    name,
    newPassword,
    oldPassword,
    latitude,
    longitude,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const hashedOldPassword = await this.hashGenerator.hash(oldPassword);

    if (client.password !== hashedOldPassword) {
      return left(new WrongCredentialsError());
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword);

    client.name = name;
    client.password = hashedNewPassword;
    client.latitude = latitude;
    client.longitude = longitude;

    await this.clientRepository.save(client);

    return right({
      client,
    });
  }
}
