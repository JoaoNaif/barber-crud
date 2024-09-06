import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';
import { OrderRepository } from '../repository/order-repository';
import { Order } from '../../enterprise/entities/order';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { Barber } from '../../enterprise/entities/barber';

interface CompletedOrderUseCaseRequest {
  barberId: string;
  orderId: string;
  stars: number;
}

type CompletedOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | WrongCredentialsError,
  {
    order: Order;
    barber: Barber;
  }
>;

export class CompletedOrderUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    barberId,
    orderId,
    stars,
  }: CompletedOrderUseCaseRequest): Promise<CompletedOrderUseCaseResponse> {
    const barber = await this.barberRepository.findById(barberId);

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.barberId !== barber.id) {
      return left(new UnauthorizedError());
    }

    if (stars > 5 || stars < 1) {
      return left(new WrongCredentialsError());
    }

    order.status = `Pedido Finalizado`;

    await this.orderRepository.save(order);

    barber.metrics += 1;

    await this.barberRepository.save(barber);

    const average: number = (barber.stars + stars) / barber.metrics;

    barber.stars = average;

    await this.barberRepository.save(barber);

    return right({
      order,
      barber,
    });
  }
}
