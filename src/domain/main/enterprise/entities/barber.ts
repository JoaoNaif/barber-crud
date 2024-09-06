import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';
import { Cpf } from './object-values/cpf';

export interface BarberProps {
  name: string;
  cpf: Cpf;
  password: string;
  beardPrice: number;
  hairPrice: number;
  eyebrowPrice: number;
  stars: number;
  metrics: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export class Barber extends Entity<BarberProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get hairPrice() {
    return this.props.hairPrice;
  }

  get eyebrowPrice() {
    return this.props.eyebrowPrice;
  }

  get beardPrice() {
    return this.props.beardPrice;
  }

  get stars(): number {
    return this.props.stars;
  }

  get metrics() {
    return this.props.metrics;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set hairPrice(hairPrice: number) {
    this.props.hairPrice = hairPrice;
  }

  set beardPrice(beardPrice: number) {
    this.props.beardPrice = beardPrice;
  }

  set eyebrowPrice(eyebrowPrice: number) {
    this.props.eyebrowPrice = eyebrowPrice;
  }

  set stars(stars: number) {
    this.props.stars = stars;
  }

  set metrics(metrics: number) {
    this.props.metrics = metrics;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  static create(
    props: Optional<
      BarberProps,
      | 'createdAt'
      | 'stars'
      | 'metrics'
      | 'beardPrice'
      | 'eyebrowPrice'
      | 'hairPrice'
    >,
    id?: UniqueEntityId
  ) {
    const baber = new Barber(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        stars: props.stars ?? -1,
        metrics: props.metrics ?? 0,
        hairPrice: props.hairPrice ?? 30,
        eyebrowPrice: props.eyebrowPrice ?? 10,
        beardPrice: props.beardPrice ?? 20,
      },
      id
    );

    return baber;
  }
}
