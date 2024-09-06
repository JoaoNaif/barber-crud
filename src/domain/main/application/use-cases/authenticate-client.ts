import { Either, left, right } from '../../../../core/either';
import { Encrypter } from '../cryptography/encrypter';
import { HashCompare } from '../cryptography/hash-compare';
import { ClientRepository } from '../repository/client-repository';
import { ClientAlreadyExistsError } from './errors/client-already-exists-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateClientUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    accessToken: string;
  }
>;
export class AuthenticateClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientRepository.findByEmail(email);

    if (!client) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      client.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
