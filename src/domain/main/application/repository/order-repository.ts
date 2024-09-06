import { Order } from '../../enterprise/entities/order';

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
}
