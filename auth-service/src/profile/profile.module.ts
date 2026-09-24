import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [RolesGuard],
})
export class ProfileModule {}
