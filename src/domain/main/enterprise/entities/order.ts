import { Optional } from '../../../../core/types/optional';
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id';
import { AggregateRoot } from '../../../../core/entities/aggregate-root';
import { OrderCreatedEvent } from '../events/order-created-event';
import { OrderUpdatedEvent } from '../events/order-updated-event';

export interface OrderProps {
  barberId: UniqueEntityId;
  clientId: UniqueEntityId;
  status: string;
  hair: boolean;
  eyebrow: boolean;
  beard: boolean;
  price: number;
  difficulty: 'easy' | 'intermediary' | 'hard';
  time: Date;
  createdAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {
  get barberId() {
    return this.props.barberId;
  }

  get clientId() {
    return this.props.clientId;
  }

  get status() {
    return this.props.status;
  }

  get hair() {
    return this.props.hair;
  }

  get eyebrow() {
    return this.props.eyebrow;
  }

  get beard() {
    return this.props.beard;
  }

  get price() {
    return this.props.price;
  }

  get difficulty() {
    return this.props.difficulty;
  }

  get time() {
    return this.props.time;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set status(status: string) {
    if (status !== this.props.status) {
      this.addDomainEvent(new OrderUpdatedEvent(this));
    }

    this.props.status = status;
  }

  set time(time: Date) {
    this.props.time = time;
  }

  static create(
    props: Optional<
      OrderProps,
      'createdAt' | 'hair' | 'eyebrow' | 'beard' | 'time'
    >,
    id?: UniqueEntityId
  ) {
    const order = new Order(
      {
        ...props,
        hair: props.hair ?? false,
        eyebrow: props.eyebrow ?? false,
        beard: props.beard ?? false,
        createdAt: props.createdAt ?? new Date(),
        time: props.time ?? new Date(),
      },
      id
    );

    const isNewOrder = !id;

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order));
    }

    return order;
  }
}
