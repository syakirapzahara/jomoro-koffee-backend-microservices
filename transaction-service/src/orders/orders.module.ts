import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartModule } from '../cart/cart.module';
import { ProductClientModule } from '../product-client/product-client.module';
@Module({
  imports: [CartModule, ProductClientModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
