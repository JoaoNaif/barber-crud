import { Optional } from '../../../../core/types/optional';
import { ClientFavoriteList } from './client-favorite-list';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { AggregateRoot } from '../../../../core/entities/aggregate-root';

export interface ClientProps {
  name: string;
  email: string;
  password: string;
  favorites: ClientFavoriteList;
  latitude: number;
  longitude: number;
  createAt: Date;
}

export class Client extends AggregateRoot<ClientProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get favorites() {
    return this.props.favorites;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get createAt() {
    return this.props.createAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set favorites(favorites: ClientFavoriteList) {
    this.props.favorites = favorites;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  static create(
    props: Optional<ClientProps, 'createAt' | 'favorites'>,
    id?: UniqueEntityId
  ) {
    const client = new Client(
      {
        ...props,
        favorites: props.favorites ?? new ClientFavoriteList(),
        createAt: props.createAt ?? new Date(),
      },
      id
    );

    return client;
  }
}
