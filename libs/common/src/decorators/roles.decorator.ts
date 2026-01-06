import { SetMetadata } from '@nestjs/common';
import { UserRoles, ROLES_KEY } from '../constants';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
