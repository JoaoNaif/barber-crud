import { Either, left, right } from '../../../../core/either';
import { Barber } from '../../enterprise/entities/barber';
import { Cpf } from '../../enterprise/entities/object-values/cpf';
import { HashGenerator } from '../cryptography/hash-generator';
import { BarberRepository } from '../repository/barber-repository';
import { BarberAlreadyExistsError } from './errors/barber-already-exists-error';

interface RegisterBarberUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  latitude: number;
  longitude: number;
}

type RegisterBarberUseCaseResponse = Either<
  BarberAlreadyExistsError,
  {
    barber: Barber;
  }
>;
export class RegisterBarberUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    cpf,
    name,
    password,
    latitude,
    longitude,
  }: RegisterBarberUseCaseRequest): Promise<RegisterBarberUseCaseResponse> {
    const sameCPF = await this.barberRepository.findByCPF(cpf);

    if (sameCPF) {
      return left(new BarberAlreadyExistsError(cpf));
    }

    const cpfText = Cpf.createFromText(cpf);
    const hashedPassword = await this.hashGenerator.hash(password);

    const barber = Barber.create({
      cpf: cpfText,
      name,
      password: hashedPassword,
      latitude,
      longitude,
    });

    await this.barberRepository.create(barber);

    return right({
      barber,
    });
  }
}
