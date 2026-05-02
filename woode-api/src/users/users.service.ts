import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUserProfile.dto.js';
import { UserRole } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) { }

  /**
   * Calculate total spent from only COMPLETED orders
   */
  private async getCompletedOrdersTotal(userId: number): Promise<number> {
    const result = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        userId,
        status: 'COMPLETED',
        isDeleted: false,
      },
    });

    return result._sum.total || 0;
  }

  /**
   * Count completed orders for a user
   */
  private async getCompletedOrdersCount(userId: number): Promise<number> {
    return this.prisma.order.count({
      where: {
        userId,
        status: 'COMPLETED',
        isDeleted: false,
      },
    });
  }

  /**
   * Calculate loyalty points from order history
   * Logic:
   * - COMPLETED: +earnedPoint -usedPoint
   * - CANCELLED: +usedPoint (hoàn lại)
   * - PENDING/CONFIRMED/SHIPPING: Không tính
   */
  private async getCalculatedLoyaltyPoints(userId: number): Promise<number> {
  const orders = await this.prisma.order.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      status: true,
      usedPoint: true,
      earnedPoint: true,
    },
  });

  let loyaltyPoints = 0;

  for (const order of orders) {
    const usedPoint = order.usedPoint || 0;
    const earnedPoint = order.earnedPoint || 0;

    /**
     * Logic tính điểm:
     *
     * 1. Đơn COMPLETED:
     *    - Cộng điểm tích lũy earnedPoint
     *    - Trừ điểm đã dùng usedPoint
     *
     * 2. Đơn CANCELLED:
     *    - Không cộng earnedPoint
     *    - Không trừ usedPoint
     *    Vì đơn hủy thì điểm đã dùng coi như được hoàn lại
     *
     * 3. Đơn đang xử lý / pending / shipping:
     *    - Trừ usedPoint vì điểm đã được dùng khi đặt hàng
     *    - Chưa cộng earnedPoint vì đơn chưa hoàn thành
     */

    if (order.status === 'COMPLETED') {
      loyaltyPoints += earnedPoint;
      loyaltyPoints -= usedPoint;
    } else if (order.status === 'CANCELLED') {
      continue;
    } else {
      loyaltyPoints -= usedPoint;
    }
  }

  return Math.max(0, loyaltyPoints);
}

  async findAll(showDeleted: boolean = false) {
    // Admin: show all users (include deleted if requested)
    const where = showDeleted ? {} : { isDeleted: false };
    
    const users = await this.prisma.user.findMany({
      where,
    });
    
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      loyaltyPoint: user.loyaltyPoint,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isDeleted: user.isDeleted,
      isActive: user.isActive,
      deletedAt: user.deletedAt,
    }));
  }

  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        loyaltyPoint: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate actual values from completed orders only
    const totalSpentFromCompleted = await this.getCompletedOrdersTotal(userId);
    const totalOrdersCompleted = await this.getCompletedOrdersCount(userId);
    const calculatedLoyaltyPoints = await this.getCalculatedLoyaltyPoints(userId);

    // Update database if calculated points differ from stored points
    if (calculatedLoyaltyPoints !== user.loyaltyPoint) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          loyaltyPoint: calculatedLoyaltyPoints,
        },
      });
    }

    return {
      ...user,
      totalOrders: totalOrdersCompleted,
      totalSpent: totalSpentFromCompleted,
      loyaltyPoint: calculatedLoyaltyPoints,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        loyaltyPoint: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate actual values from completed orders only
    const totalSpentFromCompleted = await this.getCompletedOrdersTotal(userId);
    const totalOrdersCompleted = await this.getCompletedOrdersCount(userId);
    const calculatedLoyaltyPoints = await this.getCalculatedLoyaltyPoints(userId);

    // Update database if calculated points differ from stored points
    if (calculatedLoyaltyPoints !== user.loyaltyPoint) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          loyaltyPoint: calculatedLoyaltyPoints,
        },
      });
    }

    return {
      ...user,
      totalOrders: totalOrdersCompleted,
      totalSpent: totalSpentFromCompleted,
      loyaltyPoint: calculatedLoyaltyPoints,
    };
  }

  async create(dto: CreateUserDto) {
    // check phone (unique)
    const existPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    // check email (optional)
    if (dto.email) {
      const existEmail = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (existEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    const hash = dto.password ? await bcrypt.hash(dto.password, 10) : await bcrypt.hash(Date.now().toString(), 10);

    return this.prisma.user.create({
      data: {
        email: dto.email ?? null,
        password: hash,
        name: dto.name,
        role: dto.role,
        phone: dto.phone,
        phoneVerified: true,
      },
    });
  }
  async updateProfile(userId: number, dto: UpdateUserDto) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Rule: Cannot modify CUSTOMER
    if (user.role === UserRole.CUSTOMER) {
      throw new ForbiddenException('Cannot modify customer user information');
    }

    const data = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );
    // update
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });

  }

  async deleteProfile(userId: number) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ✅ Check if user has any orders
    const orderCount = await this.prisma.order.count({
      where: { userId: userId },
    });

    if (orderCount > 0) {
      throw new BadRequestException(`Không thể xóa người dùng vì có ${orderCount} đơn hàng`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      },
    });
  }
  async restoreProfile(userId: number) {
    // check user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: false, deletedAt: null },
    });
  }
  // 🔥 Khóa tài khoản (set isActive = false)
  async deactivateAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  // 🔥 Kích hoạt tài khoản (set isActive = true)
  async activateAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }
  async getLoyaltyInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        loyaltyPoint: true,
        totalOrders: true,
        totalSpent: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;

  }

  async updateLoyaltyFromOrder(userId: number, orderAmount: number) {
    // check user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const earnedPoints = Math.floor(orderAmount / 10); // 10% of final amount paid (after all discounts)

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderAmount },
        loyaltyPoint: { increment: earnedPoints },
      },
      select: {
        id: true,
        totalOrders: true,
        totalSpent: true,
        loyaltyPoint: true,
      },
    });
  }

  async useLoyaltyPoints(userId: number, points: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.loyaltyPoint < points) {
      throw new BadRequestException('Not enough loyalty points');
    }

    if (points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }

    const discount = points * 1; // 1 point = 1 VND discount

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoint: { decrement: points },
      },
      select: {
        id: true,
        loyaltyPoint: true,
      }
    });

    return {
      ...updatedUser,
      discount,
    };
  }

  async updateUserRole(userId: number, newRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentRole = user.role;

    // Rule: CUSTOMER can't become ADMIN or STAFF
    if (currentRole === UserRole.CUSTOMER &&
      (newRole === UserRole.ADMIN || newRole === UserRole.STAFF)) {
      throw new ForbiddenException('Customers cannot be promoted to staff or admin');
    }

    // Rule: STAFF/ADMIN can't downgrade to CUSTOMER
    if ((currentRole === UserRole.STAFF || currentRole === UserRole.ADMIN) &&
      newRole === UserRole.CUSTOMER) {
      throw new ForbiddenException('Staff and admin cannot be downgraded to customer');
    }

    //  Rule: STAFF → ADMIN is allowed (no extra checks needed, admin already verified by guard)

    //  Rule: ADMIN → STAFF, but check if ≥1 active admin remains
    if (currentRole === UserRole.ADMIN && newRole === UserRole.STAFF) {
      const activeAdmins = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isDeleted: false, // Only count active admins
          id: { not: userId }, // Exclude the user being demoted
        },
      });

      if (activeAdmins === 0) {
        throw new ForbiddenException(
          'Cannot demote the last active admin. At least one active admin must exist.',
        );
      }
    }

    // Proceed with update
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
