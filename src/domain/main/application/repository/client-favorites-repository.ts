import { ClientFavorite } from '../../enterprise/entities/client-favorite';

export abstract class ClientFavoritesRepository {
  abstract createMany(favorites: ClientFavorite[]): Promise<void>;
  abstract deleteMany(favorites: ClientFavorite[]): Promise<void>;
  abstract findManyByClientId(clientId: string): Promise<ClientFavorite[]>;
  abstract deleteManyByClientId(clientId: string): Promise<void>;
}
