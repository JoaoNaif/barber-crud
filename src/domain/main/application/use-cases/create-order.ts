import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { Either, left, right } from '../../../../core/either';
import { Order } from '../../enterprise/entities/order';
import { BarberRepository } from '../repository/barber-repository';
import { ClientRepository } from '../repository/client-repository';
import { OrderRepository } from '../repository/order-repository';
import { setPriceBasedOnOrder } from './middlewares/set-price-based-on-order';

interface CreateOrderUseCaseRequest {
  barberId: string;
  clientId: string;
  hair: boolean;
  eyebrow: boolean;
  beard: boolean;
  difficulty: 'easy' | 'intermediary' | 'hard';
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;
export class CreateOrderUseCase {
  constructor(
    private barberRepository: BarberRepository,
    private clientRepository: ClientRepository,
    private orderRepository: OrderRepository
  ) {}

  async execute({
    barberId,
    clientId,
    beard,
    hair,
    eyebrow,
    difficulty,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const barber = await this.barberRepository.findById(barberId);

    if (!barber) {
      return left(new ResourceNotFoundError());
    }

    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const price = setPriceBasedOnOrder(
      hair,
      eyebrow,
      beard,
      barber,
      difficulty
    );

    const order = Order.create({
      barberId: barber.id,
      clientId: client.id,
      status: `Aguardando ${barber.name} confirmar o pedido`,
      hair,
      beard,
      eyebrow,
      price,
      difficulty,
    });

    await this.orderRepository.create(order);

    return right({
      order,
    });
  }
}
