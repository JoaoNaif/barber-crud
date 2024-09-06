import { FavoritesRepository } from '@/domain/main/application/repository/favorites-repository';
import { Favorite } from '@/domain/main/enterprise/entities/favorite';

export class InMemoryFavoritesRepository implements FavoritesRepository {
  public items: Favorite[] = [];

  async create(favorites: Favorite) {
    this.items.push(favorites);
  }
}
