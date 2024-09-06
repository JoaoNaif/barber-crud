import { Client } from '@/domain/main/enterprise/entities/client';
import { InMemoryClientFavoritesRepository } from './in-memory-client-favorites-repository';
import { ClientRepository } from '@/domain/main/application/repository/client-repository';

export class InMemoryClientRepository implements ClientRepository {
  public items: Client[] = [];

  constructor(
    private clientFavoritesRepository: InMemoryClientFavoritesRepository
  ) {}

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email);

    if (!client) {
      return null;
    }

    return client;
  }

  async findById(id: string) {
    const client = this.items.find((item) => item.id.toString() === id);

    if (!client) {
      return null;
    }

    return client;
  }

  async create(client: Client) {
    this.items.push(client);

    await this.clientFavoritesRepository.createMany(
      client.favorites.getItems()
    );
  }

  async save(client: Client) {
    const itemIndex = this.items.findIndex((item) => item.id === client.id);

    this.items[itemIndex] = client;

    await this.clientFavoritesRepository.createMany(
      client.favorites.getNewItems()
    );

    await this.clientFavoritesRepository.deleteMany(
      client.favorites.getRemovedItems()
    );
  }

  async delete(client: Client) {
    const itemIndex = this.items.findIndex((item) => item.id === client.id);

    this.items.splice(itemIndex, 1);

    this.clientFavoritesRepository.deleteManyByClientId(client.id.toString());
  }
}
