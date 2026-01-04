import { IsDefined, IsNumber } from 'class-validator';

export class CreateChargeDto {
  @IsDefined({
    message: 'Please provide charge amount',
  })
  @IsNumber()
  amount: number;
}
