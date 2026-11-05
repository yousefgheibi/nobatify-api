import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { normalizeIranMobile } from '../common/phone.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const phone = normalizeIranMobile(dto.phone);
    if (!phone) throw new BadRequestException('شماره موبایل معتبر نیست');

    if (
      await this.prisma.business.findUnique({
        where: { slug: dto.slug },
        select: { id: true },
      })
    ) {
      throw new ConflictException('این آدرس رزرو قبلاً گرفته شده است');
    }
    if (
      await this.prisma.user.findUnique({
        where: { phone },
        select: { id: true },
      })
    ) {
      throw new ConflictException('این شماره قبلاً ثبت شده است');
    }

    const business = await this.prisma.business.create({
      data: {
        slug: dto.slug,
        name: dto.businessName,
        category: dto.category,
        city: dto.city,
        phone,
        owner: {
          create: {
            phone,
            fullName: dto.fullName,
            passwordHash: await bcrypt.hash(dto.password, 10),
          },
        },
        hours: {
          create: Array.from({ length: 7 }, (_, weekday) => ({
            weekday,
            isOpen: weekday !== 6,
            opensMin: 540,
            closesMin: 1200,
          })),
        },
      },
      include: { owner: { select: { id: true } } },
    });

    return {
      token: await this.sign(business.owner!.id, business.id),
      businessId: business.id,
    };
  }

  async login(dto: LoginDto) {
    const invalid = new UnauthorizedException('شماره یا رمز عبور اشتباه است');
    const phone = normalizeIranMobile(dto.phone);
    if (!phone) throw invalid;

    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw invalid;

    return {
      token: await this.sign(user.id, user.businessId),
      businessId: user.businessId,
    };
  }

  private sign(userId: string, businessId: string): Promise<string> {
    return this.jwt.signAsync({ sub: userId, bid: businessId });
  }
}
