import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Create user',
    description: 'Create user for login in the application',
  })
  @Post('/createUser')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    this.logger.log(
      `Init create user with username : ${createUserDto.username}`,
    );
    try {
      const newUser = await this.userService.createUser(createUserDto);
      this.logger.log(`User created: ${newUser}`);
      return res.status(HttpStatus.CREATED).send(newUser);
    } catch (error) {
      this.logger.error(`Error in create user: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }
}
