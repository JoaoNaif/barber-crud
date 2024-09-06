import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { BarberRepository } from '../repository/barber-repository';
import { OrderRepository } from '../repository/order-repository';
import { Order } from '../../enterprise/entities/order';
import { setTimeBasedOnDifficulty } from './middlewares/set-time-based-on-difficulty';

interface InitialTimeBarberOrderUseCaseRequest {
  barberId: string;
  orderId: string;
}

type InitialTimeBarberOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    order: Order;
  }
>;

export class InitialTimeBarberOrderUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    barberId,
    orderId,
  }: InitialTimeBarberOrderUseCaseRequest): Promise<InitialTimeBarberOrderUseCaseResponse> {
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

    const time = setTimeBasedOnDifficulty(order.difficulty);

    order.time = time;
    order.status = `Hora prevista para finalização ${time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`;

    await this.orderRepository.save(order);

    return right({
      order,
    });
  }
}
