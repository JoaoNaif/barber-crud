import { ClientFavoritesRepository } from '@/domain/main/application/repository/client-favorites-repository';
import { ClientFavorite } from '@/domain/main/enterprise/entities/client-favorite';

export class InMemoryClientFavoritesRepository
  implements ClientFavoritesRepository
{
  public items: ClientFavorite[] = [];

  async findManyByClientId(clientId: string) {
    const clientFavorites = this.items.filter(
      (item) => item.clientId.toString() === clientId
    );

    return clientFavorites;
  }

  async createMany(favorites: ClientFavorite[]) {
    this.items.push(...favorites);
  }

  async deleteMany(favorites: ClientFavorite[]) {
    const clientFavorites = this.items.filter((item) => {
      return !favorites.some((favorite) => favorite.equals(item));
    });

    this.items = clientFavorites;
  }

  async deleteManyByClientId(clientId: string) {
    const clientFavorites = this.items.filter(
      (item) => item.clientId.toString() !== clientId
    );

    this.items = clientFavorites;
  }
}
