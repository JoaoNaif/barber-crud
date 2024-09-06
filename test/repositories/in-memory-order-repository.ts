import { DomainEvents } from '../../src/core/events/domain-events';
import { OrderRepository } from '@/domain/main/application/repository/order-repository';
import { Order } from '../../src/domain/main/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async create(order: Order) {
    this.items.push(order);

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(itemIndex, 1);
  }
}
