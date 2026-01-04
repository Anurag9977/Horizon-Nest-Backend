import { CreateChargeDto } from '@app/common/dto/create-charge.dto';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
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
