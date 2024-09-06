import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Favorite,
  FavoriteProps,
} from '../../src/domain/main/enterprise/entities/favorite';
import { faker } from '@faker-js/faker';

export function makeFavorite(
  override: Partial<FavoriteProps> = {},
  id?: UniqueEntityId
) {
  const favorite = Favorite.create(
    {
      title: faker.lorem.slug(),
      stars: faker.number.int(),
      ...override,
    },
    id
  );

  return favorite;
}
