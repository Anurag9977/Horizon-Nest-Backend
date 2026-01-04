import { AbstractRepository } from '@app/common';
import { Injectable, Logger, type LoggerService } from '@nestjs/common';
import { ReservationsDocument } from './models/reservations.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationsDocument> {
  protected readonly loggerService: LoggerService = new Logger(
    ReservationsRepository.name,
  );
  constructor(
    @InjectModel(ReservationsDocument.name)
    reservationsModel: Model<ReservationsDocument>,
  ) {
    super(reservationsModel);
  }
}
