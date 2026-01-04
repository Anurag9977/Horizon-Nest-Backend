import { LoggerService, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.document';
import { Model, QueryFilter, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly loggerService: LoggerService;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
    });

    return (await createdDocument.save()).toJSON();
  }

  async findOne(queryFilter: QueryFilter<TDocument>): Promise<TDocument> {
    const findDocument = await this.model.findOne(queryFilter).lean();
    if (!findDocument) {
      this.loggerService.warn(
        'No document found with query filter: ',
        queryFilter,
      );
      throw new NotFoundException('No document found');
    }
    return findDocument;
  }

  async findOneAndUpdate(
    queryFilter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const updatedDocument = await this.model
      .findOneAndUpdate(queryFilter, update, { new: true })
      .lean();
    if (!updatedDocument) {
      this.loggerService.warn(
        'No document found with query filter: ',
        queryFilter,
      );
      throw new NotFoundException('No document found');
    }
    return updatedDocument;
  }

  async find(queryFilter: QueryFilter<TDocument>): Promise<TDocument[]> {
    return await this.model.find(queryFilter).lean();
  }

  async findOneAndDelete(
    queryFilter: QueryFilter<TDocument>,
  ): Promise<TDocument> {
    const deletedDocument = await this.model
      .findOneAndDelete(queryFilter)
      .lean();
    if (!deletedDocument) {
      this.loggerService.warn(
        'No document found with query filter: ',
        queryFilter,
      );
      throw new NotFoundException('No document found');
    }
    return deletedDocument;
  }
}
