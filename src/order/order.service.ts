import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity.js';
import { Cart } from '../cart/entities/cart.entity.js';
import { CartItem } from '../cart/entities/cart-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderStatus, PaymentStatus } from '../common/enums/order.enum.js';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Cart)
        private readonly cartRepository:Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository:Repository<CartItem>,
        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,
    ){}
     async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ) {
    
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(
          `${item.product.name} is currently unavailable`,
        );
      }

      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
    }

//   ata product price total krbe
    let subtotal = 0;

    for (const item of cart.items) {
      const price =
        item.product.discountPrice ??
        item.product.price;

      subtotal += Number(price) * item.quantity;
    }

    const order = this.orderRepository.create({
      user: {
        id: userId,
      },

      firstName: createOrderDto.firstName,
      lastName: createOrderDto.lastName,
      companyName: createOrderDto.companyName,
      country: createOrderDto.country,
      streetAddress: createOrderDto.streetAddress,
      city: createOrderDto.city,
      state: createOrderDto.state,
      pinCode: createOrderDto.pinCode,
      phone: createOrderDto.phone,
      email: createOrderDto.email,
      additionalInformation: createOrderDto.additionalInformation,

      subtotal,
      total: subtotal,

      paymentMethod: createOrderDto.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
    });

    const savedOrder =
      await this.orderRepository.save(order);

    const orderItems = cart.items.map((item) => {
      const price =
        item.product.discountPrice ??
        item.product.price;

      return this.orderItemRepository.create({
        order: savedOrder,
        product: item.product,
        productName: item.product.name,
        price: Number(price),
        quantity: item.quantity,
        subtotal:
          Number(price) * item.quantity,
      });
    });

    await this.orderItemRepository.save(orderItems);


    for (const item of cart.items) {
      item.product.stock -= item.quantity;

      await this.productRepository.save(
        item.product,
      );
    }

    await this.cartItemRepository.delete({
      cart: {
        id: cart.id,
      },
    });

    return {
      message: 'Order placed successfully',
      orderId: savedOrder.id,
      subtotal,
      total: subtotal,
      paymentMethod: savedOrder.paymentMethod,
      paymentStatus: savedOrder.paymentStatus,
    };
  }

  async getMyOrders(userId: number) {
  const orders = await this.orderRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      items: {
        product: true,
      },
    },
    order: {
      id: 'DESC',
    },
  });

  return {
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,

      subtotal: Number(order.subtotal),
      total: Number(order.total),

      shippingAddress: {
        firstName: order.firstName,
        lastName: order.lastName,
        country: order.country,
        streetAddress: order.streetAddress,
        city: order.city,
        state: order.state,
        pinCode: order.pinCode,
        phone: order.phone,
        email: order.email,
      },

      items: order.items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.productName,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        product: item.product,
      })),

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })),
  };
}

async getMyOrderById(userId: number, orderId: number) {
  const order = await this.orderRepository.findOne({
    where: {
      id: orderId,
      user: {
        id: userId,
      },
    },
    relations: {
      items: {
        product: true,
      },
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  return {
    id: order.id,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,

    subtotal: Number(order.subtotal),
    total: Number(order.total),

    shippingAddress: {
      firstName: order.firstName,
      lastName: order.lastName,
      companyName: order.companyName,
      country: order.country,
      streetAddress: order.streetAddress,
      city: order.city,
      state: order.state,
      pinCode: order.pinCode,
      phone: order.phone,
      email: order.email,
      additionalInformation: order.additionalInformation,
    },

    items: order.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.productName,
      price: Number(item.price),
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      product: item.product,
    })),

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

async cancelMyOrder(userId: number, orderId: number) {
  const order = await this.orderRepository.findOne({
    where: {
      id: orderId,
      user: { id: userId },
    },
    relations: {
      items: {
        product: true,
      },
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestException('Order is already cancelled');
  }

// shipped order cancel hobe nah
  if (order.status === OrderStatus.SHIPPED) {
    throw new BadRequestException(
      'Shipped order cannot be cancelled',
    );
  }

  // Delivered order cancel hobe nah
  if (order.status === OrderStatus.DELIVERED) {
    throw new BadRequestException(
      'Delivered order cannot be cancelled',
    );
  }

  // sudhu pending r confirm order cancel hobe
  if (
    order.status !== OrderStatus.PENDING &&
    order.status !== OrderStatus.CONFIRMED
  ) {
    throw new BadRequestException(
      'This order cannot be cancelled',
    );
  }

  for (const item of order.items) {
    item.product.stock += item.quantity;

    await this.productRepository.save(item.product);
  }

  order.status = OrderStatus.CANCELLED;

  await this.orderRepository.save(order);

  return {
    message: 'Order cancelled successfully',
    orderId: order.id,
    status: order.status,
  };
}

    
}
