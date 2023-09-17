import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Process extends Document {
  @Prop()
  process_name: string;

  @Prop()
  date: Date;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
