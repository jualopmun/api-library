import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
