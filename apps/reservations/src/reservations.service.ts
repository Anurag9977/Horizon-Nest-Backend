import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, throwError } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepo: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}
  create(createReservationDto: CreateReservationDto, user: UserDocument) {
    return this.paymentClient
      .send('create-charge', {
        charge: { amount: createReservationDto.charge.amount },
        user,
      })
      .pipe(
        catchError((error) => {
          console.error('Payment Service Error: ', error);
          return throwError(
            () =>
              new BadRequestException(
                error?.message ?? 'Error charging payment',
              ),
          );
        }),
        map((response) => {
          return this.reservationsRepo.create({
            ...createReservationDto,
            userId: user._id.toString(),
            invoiceId: response,
          });
        }),
      );
  }

  findAll() {
    return this.reservationsRepo.find({});
  }

  findOne(reservationId: string) {
    return this.reservationsRepo.findOne({
      _id: reservationId,
    });
  }

  update(reservationId: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepo.findOneAndUpdate(
      {
        _id: reservationId,
      },
      {
        ...updateReservationDto,
      },
    );
  }

  delete(reservationId: string) {
    return this.reservationsRepo.findOneAndDelete({
      _id: reservationId,
    });
  }
}
