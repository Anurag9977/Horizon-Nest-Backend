import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import bcrypt from 'bcrypt';
import { UserDocument } from './users/models/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  createJwt(userPayload: UserDocument) {
    return this.jwtService.sign(userPayload);
  }
}
