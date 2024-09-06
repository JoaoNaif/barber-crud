import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';
import { OrderRepository } from '../repository/order-repository';
import { Order } from '../../enterprise/entities/order';

interface ArrivedLocalBarberOrderUseCaseRequest {
  barberId: string;
  orderId: string;
}

type ArrivedLocalBarberOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { order: Order }
>;

export class ArrivedLocalBarberOrderUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    barberId,
    orderId,
  }: ArrivedLocalBarberOrderUseCaseRequest): Promise<ArrivedLocalBarberOrderUseCaseResponse> {
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

    order.status = `${barber.name} chegou ao local`;

    await this.orderRepository.save(order);

    return right({
      order,
    });
  }
}
