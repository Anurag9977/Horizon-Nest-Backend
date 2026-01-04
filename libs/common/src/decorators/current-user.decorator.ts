import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
