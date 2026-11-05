import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface Owner {
  userId: string;
  businessId: string;
}

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; owner?: Owner }>();
    const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; bid: string }>(token);
      req.owner = { userId: payload.sub, businessId: payload.bid };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
