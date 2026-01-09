import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import {
  PAYMENTS_SERVICE,
  PLACES_SERVICE,
  PlacesDocument,
  UserDocument,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, concatMap, from, map, throwError } from 'rxjs';
import { QueryFilter } from 'mongoose';
import { ReservationsDocument } from './models/reservations.schema';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepo: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
    @Inject(PLACES_SERVICE) private readonly placesClient: ClientProxy,
  ) {}

  create(createReservationDto: CreateReservationDto, user: UserDocument) {
    const { placeId } = createReservationDto;
    // Check if the place exists
    return this.placesClient.send('get-place', { placeId }).pipe(
      catchError((error) => {
        console.error('Places Service Error: ', error);
        return throwError(() =>
          error.status === 404
            ? new NotFoundException(error?.message ?? 'No document found')
            : new BadRequestException(
                error?.message ?? 'Error with the place Id',
              ),
        );
      }),
      concatMap((place: PlacesDocument) =>
        this.paymentClient
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
            map((invoiceId) => ({ place, invoiceId })),
          ),
      ),
      concatMap(({ place, invoiceId }) =>
        from(
          this.reservationsRepo.create({
            ...createReservationDto,
            placeId: place._id.toString(),
            userId: user._id.toString(),
            invoiceId,
          }),
        ),
      ),
    );
  }

  findAll(queryFilter: QueryFilter<ReservationsDocument>) {
    return this.reservationsRepo.find(queryFilter);
  }

  findOne(reservationId: string, userId: string) {
    return this.reservationsRepo.findOne({
      _id: reservationId,
      userId,
    });
  }

  update(
    reservationId: string,
    userId: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsRepo.findOneAndUpdate(
      {
        _id: reservationId,
        userId,
      },
      {
        ...updateReservationDto,
      },
    );
  }

  delete(reservationId: string, userId: string) {
    return this.reservationsRepo.findOneAndDelete({
      _id: reservationId,
      userId,
    });
  }
}
