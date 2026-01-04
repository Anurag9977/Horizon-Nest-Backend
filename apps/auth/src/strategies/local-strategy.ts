import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDocument } from '../users/models/user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<UserDocument> {
    return await this.authService.validateUser(email, password);
  }
}
