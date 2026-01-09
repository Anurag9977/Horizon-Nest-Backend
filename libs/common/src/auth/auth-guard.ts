import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AUTH_SERVICE, PUBLIC_KEY, ROLES_KEY, UserRoles } from '../constants';
import { Reflector } from '@nestjs/core';
import { UserDocument } from '../models';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Required Roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
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
        tap((user: UserDocument) => {
          context.switchToHttp().getRequest().user = user;
        }),
        map((user: UserDocument) => {
          return requiredRoles
            ? requiredRoles.some((role) => role === user.role)
            : true;
        }),
      );
  }
}
