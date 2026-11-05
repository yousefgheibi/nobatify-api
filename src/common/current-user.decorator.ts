import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Owner } from '../auth/auth.guard.js';

/** Injects the logged-in owner ({ userId, businessId }) into a route handler. */
export const CurrentOwner = createParamDecorator((_data: unknown, ctx: ExecutionContext): Owner => {
  const req = ctx.switchToHttp().getRequest<{ owner?: Owner }>();
  if (!req.owner) throw new Error('CurrentOwner used without OwnerGuard');
  return req.owner;
});
