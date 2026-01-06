import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class PlacesDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  city: string;

  @Prop()
  costPerNight: number;
}

export const PlacesSchema = SchemaFactory.createForClass(PlacesDocument);
