import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Book } from './book.model';

import { User } from './user.model';

@Schema()
export class Author extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
  @ApiProperty()
  createdById: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  bibliography: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Book' }])
  @ApiProperty()
  books: Book[];
}

export const UserSchema = SchemaFactory.createForClass(Author);
