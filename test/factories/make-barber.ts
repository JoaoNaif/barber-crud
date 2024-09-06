import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Barber,
  BarberProps,
} from '../../src/domain/main/enterprise/entities/barber';
import { faker } from '@faker-js/faker';
import { fakeRandomGenerateCPF } from 'test/utils/fake-random-generate-CPF';

export function makeBarber(
  override: Partial<BarberProps> = {},
  id?: UniqueEntityId
) {
  const fakeCPF = fakeRandomGenerateCPF();
  const barber = Barber.create(
    {
      name: faker.person.fullName(),
      cpf: fakeCPF,
      password: faker.internet.password(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id
  );

  return barber;
}
