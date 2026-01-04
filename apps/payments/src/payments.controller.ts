import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateChargePayloadDto } from './dto/create-charge-payload.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
  @MessagePattern('create-charge')
  async createCharge(@Payload() payload: CreateChargePayloadDto) {
    return await this.paymentsService.createCharge(
      payload.charge.amount,
      payload.user,
    );
  }

  @Get('/')
  getAllPayments() {
    return this.paymentsService.getAll();
  }
}
