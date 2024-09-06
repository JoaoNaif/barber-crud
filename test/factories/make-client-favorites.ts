import { UniqueEntityId } from '../../src/core/entities/unique-entity-id';
import {
  ClientFavorite,
  ClientFavoriteProps,
} from '../../src/domain/main/enterprise/entities/client-favorite';

export function makeClientFavorites(
  override: Partial<ClientFavoriteProps> = {},
  id?: UniqueEntityId
) {
  const clientfavorites = ClientFavorite.create(
    {
      clientId: new UniqueEntityId(),
      favoriteId: new UniqueEntityId(),
      ...override,
    },
    id
  );

  return clientfavorites;
}
