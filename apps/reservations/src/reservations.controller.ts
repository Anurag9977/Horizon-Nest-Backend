import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@app/common/auth/auth-guard';
import { CurrentUser } from '@app/common';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }
}
