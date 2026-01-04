import { Inject, Injectable } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!);
  }

  async createCharge(amount: number, user: UserDocument) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      payment_method: 'pm_card_visa',
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    // Creating a payment entry
    await this.paymentsRepository.create({
      paymentIntentId: paymentIntent.id,
      amount,
      status: paymentIntent.status,
      userId: user._id.toString(),
    });
    // Sending email notification
    this.notificationClient.emit('notify-email', {
      emailId: user.email,
      emailSubject: 'Payment Received',
      emailBody: `Payment of INR ${amount} successfully received.\nHope you have a nice stay. \n\nThanks.`,
    });

    return paymentIntent.id;
  }

  getAll() {
    return this.paymentsRepository.find({});
  }
}
