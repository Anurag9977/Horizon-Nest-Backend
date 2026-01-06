import { AbstractDocument, UserRoles } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: SchemaTypes.String, enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
