import { Barber } from '../../enterprise/entities/barber';

export interface findManyNearbyParams {
  latitude: number;
  longitude: number;
}

export abstract class BarberRepository {
  abstract findByCPF(cpf: string): Promise<Barber | null>;
  abstract findById(id: string): Promise<Barber | null>;
  abstract findManyNameBarber(name: string, page: number): Promise<Barber[]>;
  abstract findManyNearby(params: findManyNearbyParams): Promise<Barber[]>;

  abstract findManyFavorites(ids: string[]): Promise<Barber[]>;
  abstract create(barber: Barber): Promise<void>;
  abstract save(barber: Barber): Promise<void>;
  abstract delete(barber: Barber): Promise<void>;
}
