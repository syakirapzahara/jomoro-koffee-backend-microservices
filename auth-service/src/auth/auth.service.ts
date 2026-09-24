import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  isLettersOnly,
  isNotEmpty,
  isValidEmailDomain,
  isValidPassword,
} from '../common/validators';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!isNotEmpty(dto.first_name)) {
      throw new BadRequestException('First name is required.');
    }

    if (!isNotEmpty(dto.last_name)) {
      throw new BadRequestException('Last name is required.');
    }

    if (!isNotEmpty(dto.email)) {
      throw new BadRequestException('Email is required.');
    }

    if (!isNotEmpty(dto.password)) {
      throw new BadRequestException('Password is required.');
    }

    if (!isLettersOnly(dto.first_name)) {
      throw new BadRequestException(
        'First name must contain letters only (no numbers or special characters).',
      );
    }

    if (!isLettersOnly(dto.last_name)) {
      throw new BadRequestException(
        'Last name must contain letters only (no numbers or special characters).',
      );
    }

    if (!isValidEmailDomain(dto.email)) {
      throw new BadRequestException(
        'Email must end with a valid domain such as .com, .net, .org, or .id.',
      );
    }

    if (!isValidPassword(dto.password)) {
      throw new BadRequestException(
        'Password cannot contain spaces, must have at least 8 characters, and contain at least 2 numeric digits.',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered.');
    }

    await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });

    return { message: 'Registration successful.' };
  }

  async login(dto: LoginDto) {
    if (!isNotEmpty(dto.email)) {
      throw new BadRequestException('Email is required.');
    }

    if (!isNotEmpty(dto.password)) {
      throw new BadRequestException('Password is required.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    if (user.password !== dto.password) {
      throw new UnauthorizedException('Password does not match.');
    }

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return {
      message: 'Login successful.',
      access_token: token,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
  }
}
