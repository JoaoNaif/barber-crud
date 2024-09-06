import { BarberRepository } from '../../../../domain/main/application/repository/barber-repository';
import { EventHandler } from '../../../../core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '../../../../core/events/domain-events';
import { OrderCreatedEvent } from '../../../../domain/main/enterprise/events/order-created-event';

export class OnOrderCreated implements EventHandler {
  constructor(
    private barberRepository: BarberRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderCreatedEvent.name
    );
  }

  private async sendNewOrderNotification({ order }: OrderCreatedEvent) {
    const recipient = await this.barberRepository.findById(
      order.barberId.toString()
    );

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Novo Pedido',
        content: order.status,
      });
    }
  }
}
