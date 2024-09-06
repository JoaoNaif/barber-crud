import { WatchedList } from '../../../../core/entities/watched-list';
import { ClientFavorite } from './client-favorite';

export class ClientFavoriteList extends WatchedList<ClientFavorite> {
  compareItems(a: ClientFavorite, b: ClientFavorite): boolean {
    return a.favoriteId.equals(b.favoriteId);
  }
}
