import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CurrentUser, Roles, UserRoles } from '@app/common';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  @Roles(UserRoles.USER)
  findAll(@CurrentUser() user: UserDocument) {
    return this.reservationsService.findAll({
      userId: user._id.toString(),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.reservationsService.findOne(id, user._id.toString());
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(
      id,
      user._id.toString(),
      updateReservationDto,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.reservationsService.delete(id, user._id.toString());
  }
}
