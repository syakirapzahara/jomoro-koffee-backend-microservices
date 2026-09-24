import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';

interface AuthenticatedRequest extends Request {
  user: { id: number; role: string };
}

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.id);
  }
}
