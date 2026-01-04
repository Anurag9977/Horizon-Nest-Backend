import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AUTH_SERVICE } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const accessToken = context.switchToHttp().getRequest().session
      ?.accessToken as string;
    if (!accessToken) {
      return false;
    }
    return this.authClient
      .send('authenticate', {
        accessToken,
      })
      .pipe(
        catchError((error) => {
          console.error('Auth Service Error: ', error);
          return throwError(() => new UnauthorizedException('Request Denied'));
        }),
        tap((res: UserDocument) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
