import { ROLES_KEY, UserDocument, UserRoles } from '@app/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Required Roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const user: UserDocument = context.switchToHttp().getRequest().user;
    return requiredRoles
      ? requiredRoles.some((role) => role === user.role)
      : true;
  }
}
