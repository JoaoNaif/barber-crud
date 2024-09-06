import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Barber } from '../../enterprise/entities/barber';
import { HashGenerator } from '../cryptography/hash-generator';
import { BarberRepository } from '../repository/barber-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditBarberUseCaseRequest {
  id: string;
  name: string;
  newPassword: string;
  oldPassword: string;
  beardPrice: number;
  hairPrice: number;
  eyebrowPrice: number;
  latitude: number;
  longitude: number;
}

type EditBarberUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    barber: Barber;
  }
>;

export class EditBarberUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    id,
    name,
    newPassword,
    oldPassword,
    hairPrice,
    beardPrice,
    eyebrowPrice,
    latitude,
    longitude,
  }: EditBarberUseCaseRequest): Promise<EditBarberUseCaseResponse> {
    const barber = await this.barberRepository.findById(id);

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const hashedOldPassword = await this.hashGenerator.hash(oldPassword);

    if (barber.password !== hashedOldPassword) {
      return left(new WrongCredentialsError());
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword);

    barber.name = name;
    barber.password = hashedNewPassword;
    barber.hairPrice = hairPrice;
    barber.eyebrowPrice = eyebrowPrice;
    barber.beardPrice = beardPrice;
    barber.latitude = latitude;
    barber.longitude = longitude;

    await this.barberRepository.save(barber);

    return right({
      barber,
    });
  }
}
