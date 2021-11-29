import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = await this.userRepository.createUser(createUserDto);
    return createdUser;
  }

  async findByUsername(username: string) {
    const user: any = await this.userRepository.findByUsername(username);
    return user;
  }

  async findById(id: string) {
    const user: any = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
