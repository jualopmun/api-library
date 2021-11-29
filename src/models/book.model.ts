import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Author',
  })
  @ApiProperty()
  author: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  summary: string;
}

export const UserSchema = SchemaFactory.createForClass(Book);
