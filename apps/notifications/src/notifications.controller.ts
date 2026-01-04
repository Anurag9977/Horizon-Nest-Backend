import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { SendEmailDto } from './dto/send-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notify-email')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        return new RpcException(
          errors
            .map((err) => Object.values(err.constraints ?? {}).join(', '))
            .join('; '),
        );
      },
    }),
  )
  notifyEmail(@Payload() payload: SendEmailDto) {
    const { emailId, emailSubject, emailBody } = payload;
    this.notificationsService.sendEmail(emailId, emailSubject, emailBody);
  }
}
