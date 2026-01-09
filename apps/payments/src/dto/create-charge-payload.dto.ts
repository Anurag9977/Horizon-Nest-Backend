import { UserDocument } from '@app/common';
import { CreateChargeDto } from '@app/common/dto/create-charge.dto';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';

export class CreateChargePayloadDto {
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => UserDocument)
  user: UserDocument;

  @IsDefined({
    message: 'Please provide charge amount',
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
