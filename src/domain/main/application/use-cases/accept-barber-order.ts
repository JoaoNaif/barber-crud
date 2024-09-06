import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';
import { OrderRepository } from '../repository/order-repository';
import { Order } from '../../enterprise/entities/order';

interface AcceptBarberOrderUseCaseRequest {
  barberId: string;
  orderId: string;
  accept: boolean;
}

type AcceptBarberOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null | { order: Order }
>;

export class AcceptBarberOrderUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    barberId,
    orderId,
    accept,
  }: AcceptBarberOrderUseCaseRequest): Promise<AcceptBarberOrderUseCaseResponse> {
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

    if (accept) {
      order.status = `Pedido aceito, ${barber.name} está a caminho`;

      await this.orderRepository.save(order);

      return right({
        order,
      });
    }

    await this.orderRepository.delete(order);

    return right(null);
  }
}
