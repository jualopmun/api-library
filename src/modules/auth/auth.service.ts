import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { LoginUserDto } from './dto/login.dto';

import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);

    const payload = {
      userId: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { username, password } = loginUserDto;
    let user = null;
    try {
      user = await this.usersService.findByUsername(username);
      if (!(await this.validatePassword(password, user?.password))) {
        this.logger.error(`Error unauthorized user: ${username}`);
        throw new UnauthorizedException();
      }
    } catch (error) {
      this.logger.error(`Error in login user: ${error}`);
      throw new InternalServerErrorException(error);
    }

    return user;
  }

  async validatePassword(
    passwordEntry: string,
    passwordUser: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordEntry, passwordUser);
  }
}
