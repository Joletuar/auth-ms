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

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, name } = registerUserDto;

    return await this.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  verifyToken() {
    return 'verifyToken';
  }
}
