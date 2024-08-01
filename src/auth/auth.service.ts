import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  registerUser() {
    return 'registerUser';
  }

  loginUser() {
    return 'loginUser';
  }

  verifyToken() {
    return 'verifyToken';
  }
}
