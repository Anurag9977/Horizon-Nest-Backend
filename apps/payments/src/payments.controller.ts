import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateChargePayloadDto } from './dto/create-charge-payload.dto';
import { AuthGuard, Roles, UserRoles } from '@app/common';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('test-connection')
  test() {
    console.log('Test pattern hit!');
    return 'Connection is working';
  }

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

  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Get('/')
  getAllPayments() {
    return this.paymentsService.getAll();
  }
}
