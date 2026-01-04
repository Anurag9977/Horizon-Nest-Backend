import { AbstractRepository } from '@app/common';
import { PaymentsDocument } from './models/payments.schema';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsRepository extends AbstractRepository<PaymentsDocument> {
  protected readonly loggerService: LoggerService = new Logger(
    PaymentsRepository.name,
  );
  constructor(
    @InjectModel(PaymentsDocument.name)
    paymentsModel: Model<PaymentsDocument>,
  ) {
    super(paymentsModel);
  }
}
