import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../models/user.model';
import { CreateUserDto } from '../modules/user/dto/createUser.dto';

import * as bcrypt from 'bcryptjs';

export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const passwordEncrypt = await this.hashPassword(password);
    const newUser = new this.userModel({
      username,
      password: passwordEncrypt,
    });

    try {
      const createdUser = await newUser.save();
      return createdUser;
    } catch (error) {
      this.logger.error(`Error create User repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 8);
  }

  async findByUsername(username: string) {
    try {
      return await this.userModel.findOne({ username });
    } catch (error) {
      this.logger.error(`Error find User repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      this.logger.error(`Error find by id repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
