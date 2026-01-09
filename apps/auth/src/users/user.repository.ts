import { AbstractRepository, UserDocument } from '@app/common';
import { Injectable, Logger, type LoggerService } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly loggerService: LoggerService = new Logger(
    UserRepository.name,
  );

  constructor(
    @InjectModel(UserDocument.name)
    protected readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
