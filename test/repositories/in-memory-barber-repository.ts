import {
  BarberRepository,
  findManyNearbyParams,
} from '@/domain/main/application/repository/barber-repository';
import { Barber } from '@/domain/main/enterprise/entities/barber';
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates';

export class InMemoryBarberRepository implements BarberRepository {
  public items: Barber[] = [];

  async findByCPF(cpf: string) {
    const barber = this.items.find((item) => item.cpf.value === cpf);

    if (!barber) {
      return null;
    }

    return barber;
  }

  async findById(id: string) {
    const barber = this.items.find((item) => item.id.toString() === id);

    if (!barber) {
      return null;
    }

    return barber;
  }

  async findManyNameBarber(name: string, page: number) {
    const barbers = this.items
      .filter((item) => item.name.includes(name))
      .slice((page - 1) * 20, page * 20);

    return barbers;
  }

  async findManyNearby(params: findManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        }
      );

      return distance < 30;
    });
  }

  async findManyFavorites(ids: string[]) {
    const barbers = this.items.filter((item) =>
      ids.includes(item.id.toString())
    );

    return barbers;
  }

  async create(barber: Barber) {
    this.items.push(barber);
  }

  async save(barber: Barber) {
    const itemIndex = this.items.findIndex((item) => item.id === barber.id);

    this.items[itemIndex] = barber;
  }

  async delete(barber: Barber) {
    const itemIndex = this.items.findIndex((item) => item.id === barber.id);

    this.items.splice(itemIndex, 1);
  }
}
