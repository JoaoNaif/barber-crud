import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';

export interface ClientFavoriteProps {
  clientId: UniqueEntityId;
  favoriteId: UniqueEntityId;
}

export class ClientFavorite extends Entity<ClientFavoriteProps> {
  get clientId() {
    return this.props.clientId;
  }

  get favoriteId() {
    return this.props.favoriteId;
  }

  static create(props: ClientFavoriteProps, id?: UniqueEntityId) {
    const clientFavorite = new ClientFavorite(props, id);

    return clientFavorite;
  }
}
