import { AbstractRepository } from '@app/common';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { PlacesDocument } from './models/places.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlacesRepository extends AbstractRepository<PlacesDocument> {
  protected readonly loggerService: LoggerService = new Logger(
    PlacesRepository.name,
  );
  constructor(
    @InjectModel(PlacesDocument.name) placesModel: Model<PlacesDocument>,
  ) {
    super(placesModel);
  }
}
