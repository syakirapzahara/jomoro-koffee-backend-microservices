import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesController } from '../categories/categories.controller';
import { CategoriesService } from '../categories/categories.service';
import { AdminController } from '../admin/admin.controller';
import { ServiceController } from '../service/service.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    AdminController,
    ServiceController,
  ],
  providers: [ProductsService, CategoriesService, JwtStrategy],
  exports: [ProductsService],
})
export class ProductsModule {}
