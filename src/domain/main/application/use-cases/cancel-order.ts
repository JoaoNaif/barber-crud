import { UnauthorizedError } from '../../../../core/errors/errors/unauthorized-error';
import { Either, left, right } from '../../../../core/either';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { ClientRepository } from '../repository/client-repository';
import { OrderRepository } from '../repository/order-repository';

interface CancelOrderUseCaseRequest {
  clientId: string;
  orderId: string;
}

type CancelOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>;

export class CancelOrderUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    clientId,
    orderId,
  }: CancelOrderUseCaseRequest): Promise<CancelOrderUseCaseResponse> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.clientId !== client.id) {
      return left(new UnauthorizedError());
    }

    await this.orderRepository.delete(order);

    return right(null);
  }
}
