import { Either, left, right } from '../../../../core/either';
import { Encrypter } from '../cryptography/encrypter';
import { HashCompare } from '../cryptography/hash-compare';
import { BarberRepository } from '../repository/barber-repository';
import { BarberAlreadyExistsError } from './errors/barber-already-exists-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateBarberUseCaseRequest {
  cpf: string;
  password: string;
}

type AuthenticateBarberUseCaseResponse = Either<
  BarberAlreadyExistsError,
  {
    accessToken: string;
  }
>;
export class AuthenticateBarberUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateBarberUseCaseRequest): Promise<AuthenticateBarberUseCaseResponse> {
    const barber = await this.barberRepository.findByCPF(cpf);

    if (!barber) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      barber.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: barber.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
