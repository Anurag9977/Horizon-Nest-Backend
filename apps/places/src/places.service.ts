import { Injectable } from '@nestjs/common';
import { PlacesRepository } from './places.repository';
import { CreatePlaceDto } from './dto/create-place.dto';
import { MongooseQueryParser } from 'mongoose-query-parser';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  private readonly queryParser: MongooseQueryParser;
  constructor(private readonly placesRepository: PlacesRepository) {
    this.queryParser = new MongooseQueryParser();
  }

  create({ name, city, costPerNight }: CreatePlaceDto) {
    return this.placesRepository.create({
      name,
      city,
      costPerNight,
    });
  }

  getAll(query: any) {
    const queryFilter = this.queryParser.parse(query).filter;
    return this.placesRepository.find(queryFilter);
  }

  getById(placeId: string) {
    return this.placesRepository.findOne({
      _id: placeId,
    });
  }

  update(placeId: string, updatePlaceDto: UpdatePlaceDto) {
    return this.placesRepository.findOneAndUpdate(
      {
        _id: placeId,
      },
      updatePlaceDto,
    );
  }

  delete(placeId: string) {
    return this.placesRepository.findOneAndDelete({
      _id: placeId,
    });
  }
}
