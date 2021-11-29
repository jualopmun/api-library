import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  summary: string;
}
