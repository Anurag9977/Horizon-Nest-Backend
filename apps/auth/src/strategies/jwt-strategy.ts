import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from '../users/models/user.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          const accessToken = req.session?.accessToken ?? req.accessToken;
          if (!accessToken) {
            if (!req.headers) {
              throw new RpcException('Access token not found');
            } else {
              throw new UnauthorizedException('Access token not found');
            }
          }
          return accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  validate(userPayload: UserDocument) {
    return userPayload;
  }
}
