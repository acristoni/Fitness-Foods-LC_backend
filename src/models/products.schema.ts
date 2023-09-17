import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop()
  code: number;

  @Prop()
  status: string;

  @Prop()
  imported_t: Date;

  @Prop()
  url: string;

  @Prop()
  creator: string;

  @Prop()
  created_t: Date;

  @Prop()
  last_modified_t: Date;

  @Prop()
  product_name: string;

  @Prop()
  quantity: string;

  @Prop()
  brands: string;

  @Prop()
  categories: string;

  @Prop()
  labels: string;

  @Prop()
  cities: string;

  @Prop()
  purchase_places: string;

  @Prop()
  stores: string;

  @Prop()
  ingredients_text: string;

  @Prop()
  traces: string;

  @Prop()
  serving_size: string;

  @Prop()
  serving_quantity: number;

  @Prop()
  nutriscore_score: number;

  @Prop()
  nutriscore_grade: string;

  @Prop()
  main_category: string;

  @Prop()
  image_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
