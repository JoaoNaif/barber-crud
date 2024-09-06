import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { ClientRepository } from '../repository/client-repository';

interface DeleteClientUseCaseRequest {
  id: string;
}

type DeleteClientUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    await this.clientRepository.delete(client);

    return right(null);
  }
}
