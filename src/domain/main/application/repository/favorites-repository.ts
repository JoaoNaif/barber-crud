import { Favorite } from '../../enterprise/entities/favorite';

export abstract class FavoritesRepository {
  abstract create(favorites: Favorite): Promise<void>;
}
