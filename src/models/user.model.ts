import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  username: string;

  @Prop({ required: true })
  @ApiProperty()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
