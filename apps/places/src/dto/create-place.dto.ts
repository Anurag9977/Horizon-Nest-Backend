import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  costPerNight: number;
}
