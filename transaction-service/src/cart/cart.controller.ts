import {
  Body,
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
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

interface AuthenticatedRequest extends Request {
  user: { id: number; role: string };
}

@ApiTags('Shopping Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve user cart with product details' })
  getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Req() req: AuthenticatedRequest, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items from cart' })
  clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update product quantity in cart' })
  updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, dto.quantity);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Remove product from cart' })
  removeItem(
    @Req() req: AuthenticatedRequest,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

}
