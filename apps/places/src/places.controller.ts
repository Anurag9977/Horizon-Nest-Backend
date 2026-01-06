import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Public, Roles, UserRoles } from '@app/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('/')
  createPlace(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get('/')
  @Public()
  getAllPlaces(@Query() query: any) {
    return this.placesService.getAll(query);
  }

  @Get('/:id')
  @Public()
  getPlaceById(@Param('id') id: string) {
    return this.placesService.getById(id);
  }

  @MessagePattern('get-place')
  async getPlace(@Payload() payload: any) {
    try {
      return await this.placesService.getById(payload.placeId);
    } catch (error) {
      if (error?.status === 404) {
        throw new RpcException({
          status: 404,
          message: 'No place found with this place Id',
        });
      }
      throw new RpcException(
        error?.message ?? 'Places Service Error: Something went wrong',
      );
    }
  }

  @Patch('/:id')
  @Roles(UserRoles.ADMIN)
  updatePlaceById(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete('/:id')
  @Roles(UserRoles.ADMIN)
  deletePlaceById(@Param('id') id: string) {
    return this.placesService.delete(id);
  }
}
