import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LogingUserDto } from './dtos/login.user.dto';
import { RegisterUserDto } from './dtos/register.user.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();

    this.logger.log('Connected to MongoDB');
  }

  async loginUser(loginUserDto: LogingUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findFirst({
        where: {
          email,
        },
      });

      if (!user)
        throw new RpcException({
          message: "User doesn't exists",
          status: 400,
        });

      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (!isCorrectPassword)
        throw new RpcException({
          message: 'The password is wrong',
          status: 400,
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;

      return { user: rest, token: await this.jwtService.signAsync(rest) };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        message: error.message,
        code: 500,
      });
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, name } = registerUserDto;

    try {
      if (
        await this.user.findFirst({
          where: {
            email,
          },
        })
      )
        throw new RpcException({
          message: 'User already exists',
          status: 400,
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          name,
        },
      });

      return { user: rest, token: await this.jwtService.signAsync(rest) };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        message: error.message,
        code: 500,
      });
    }
  }

  async verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sub, iat, exp, ...user } =
        await this.jwtService.verifyAsync(token);

      return {
        user,
        token: await this.jwtService.signAsync(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }
}
