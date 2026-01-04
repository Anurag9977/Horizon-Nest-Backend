import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class PaymentsDocument extends AbstractDocument {
  @Prop()
  paymentIntentId: string;

  @Prop()
  userId: string;

  @Prop()
  amount: number;

  @Prop()
  status: string;
}

export const PaymentsSchema = SchemaFactory.createForClass(PaymentsDocument);
