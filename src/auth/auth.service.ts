import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { LogingUserDto } from './dtos/login.user.dto';
import { RegisterUserDto } from './dtos/register.user.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();

    this.logger.log('Connected to MongoDB');
  }

  loginUser(loginUserDto: LogingUserDto) {
    return loginUserDto;
  }

  registerUser(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }

  verifyToken() {
    return 'verifyToken';
  }
}
