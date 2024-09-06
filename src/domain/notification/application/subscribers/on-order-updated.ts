import { ClientRepository } from '../../../../domain/main/application/repository/client-repository';
import { EventHandler } from '../../../../core/events/event-handler';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '../../../../core/events/domain-events';
import { OrderUpdatedEvent } from '../../../../domain/main/enterprise/events/order-updated-event';

export class OnOrderUpdated implements EventHandler {
  constructor(
    private clientRepository: ClientRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderUpdatedEvent.name
    );
  }

  private async sendNewOrderNotification({ order }: OrderUpdatedEvent) {
    const recipient = await this.clientRepository.findById(
      order.clientId.toString()
    );

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Atualização do Pedido',
        content: order.status,
      });
    }
  }
}
