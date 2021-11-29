import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

import { StrategyService } from './strategy/strategy.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: '2897498278789273',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [StrategyService, AuthGuardService, AuthService],
  exports: [StrategyService, AuthGuardService, AuthService],
})
export class AuthModule {}
