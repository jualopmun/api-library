import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from './../../user/user.service';

@Injectable()
export class StrategyService extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '2897498278789273',
    });
  }

  async validate(payload: { userId: string }) {
    return await this.userService.findById(payload.userId);
  }
}
