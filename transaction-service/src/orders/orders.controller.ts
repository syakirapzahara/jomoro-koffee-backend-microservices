import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrdersService } from './orders.service';

interface AuthenticatedRequest extends Request {
  user: { id: number; role: string };
}

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders for authenticated user' })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.ordersService.findAllByUser(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Checkout - process order from cart' })
  checkout(@Req() req: AuthenticatedRequest) {
    return this.ordersService.checkout(req.user.id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Fetch order detail with product information' })
  findDetail(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOrderDetail(req.user.id, id);
  }
}
