import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login in the api',
    description: 'Login in the api',
  })
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: any) {
    try {
      const auth = await this.authService.loginUser(loginUserDto);
      this.logger.log(`auth created correct`);
      return res.status(HttpStatus.CREATED).send(auth);
    } catch (error) {
      this.logger.error(`auth error ${error}`);
    }
  }
}
