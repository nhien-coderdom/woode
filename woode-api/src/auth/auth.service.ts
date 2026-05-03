import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { calculateLoyaltyTier } from '../utils/loyalty.util.js';
import admin from '../config/firebase.config.js';
import { exists } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
   * - COMPLETED: +earnedPoint -usedPoint (tích lũy được trừ đã dùng)
   * - CANCELLED: không tính (điểm đã được hoàn lại khi cancel)
   * - PENDING/CONFIRMED/SHIPPING: -usedPoint (trừ điểm đã dùng, chưa nhận tích lũy)
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

      if (order.status === 'COMPLETED') {
        // COMPLETED: +earnedPoint (tích lũy được) -usedPoint (đã dùng)
        loyaltyPoints += earnedPoint;
        loyaltyPoints -= usedPoint;
      } else if (order.status === 'CANCELLED') {
        // CANCELLED: không tính gì (điểm đã được hoàn lại khi order hủy)
        continue;
      } else {
        // PENDING/CONFIRMED/SHIPPING: -usedPoint (trừ điểm đã dùng)
        loyaltyPoints -= usedPoint;
      }
    }

    return Math.max(0, loyaltyPoints); // Never go below 0
  }

  // ================= CHECK PHONE =================
  async checkPhone(phone: string) {
    const normalizedPhone = phone.replace('+84', '0');
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    return { exists: !!user };
  }

  // ================= LOGIN EMAIL =================
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Calculate actual spent from completed orders only
    const totalSpentFromCompleted = await this.getCompletedOrdersTotal(user.id);
    const totalOrdersCompleted = await this.getCompletedOrdersCount(user.id);
    const calculatedLoyaltyPoints = await this.getCalculatedLoyaltyPoints(user.id);

    // Update database if calculated points differ from stored points
    if (calculatedLoyaltyPoints !== user.loyaltyPoint) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoint: calculatedLoyaltyPoints,
        },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        loyaltyPoint: calculatedLoyaltyPoints,
        loyaltyTier: calculateLoyaltyTier(totalSpentFromCompleted),
        totalOrders: totalOrdersCompleted,
        totalSpent: totalSpentFromCompleted,
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    const existPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existPhone) {
      throw new BadRequestException('Phone already exists');
    }

    if (dto.email) {
      const existEmail = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (existEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email ?? null,
        password: hash,
        name: dto.name,
        role: 'CUSTOMER',
        phone: dto.phone,
        address: dto.address ?? null,
      },
    });
  }

  // ================= CHANGE PASSWORD =================
  async changePassword(
    dto: { oldPassword: string; newPassword: string },
    userId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('User not found');
    }

    const oldPasswordMatch = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!oldPasswordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    // Calculate actual spent from completed orders only
    const totalSpentFromCompleted = await this.getCompletedOrdersTotal(userId);
    const totalOrdersCompleted = await this.getCompletedOrdersCount(userId);
    
    // Calculate actual loyalty points from order history
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
      loyaltyTier: calculateLoyaltyTier(totalSpentFromCompleted),
      loyaltyPoint: calculatedLoyaltyPoints,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    try {
      // Check if phone is already taken by another user 
      if (dto.phone) {
        const existingPhone = await this.prisma.user.findUnique({
          where:
            { phone: dto.phone },
        });
        if (existingPhone && existingPhone.id !== userId) {
          throw new BadRequestException('Phone already exists');
        }
      }
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.phone && { phone: dto.phone }),
          ...(dto.address && { address: dto.address }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          address: true,
          createdAt: true,
          loyaltyPoint: true,
        },
      });

      // Calculate actual spent from completed orders only
      const totalSpentFromCompleted = await this.getCompletedOrdersTotal(userId);
      const totalOrdersCompleted = await this.getCompletedOrdersCount(userId);

      return {
        ...updatedUser,
        totalOrders: totalOrdersCompleted,
        totalSpent: totalSpentFromCompleted,
        loyaltyTier: calculateLoyaltyTier(totalSpentFromCompleted),
      };
    }
    catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta.target[0];
        throw new BadRequestException(`${field} already exists`);
      }
      throw error;
    }
  }
  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(
        token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
      return { access_token: newAccessToken };
    }
    catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  // ================= FIREBASE LOGIN =================
  async firebaseLogin(idToken: string, profile?: any) {
  const decoded = await admin.auth().verifyIdToken(idToken);

  const phone = decoded.phone_number;

  if (!phone) {
    throw new UnauthorizedException('No phone number in token');
  }

  const normalizedPhone = phone.replace('+84', '0');

  console.log('📞 Firebase phone:', normalizedPhone);
  console.log('🧾 Profile from client:', profile);

  let user = await this.prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  // ======================
  // CREATE USER
  // ======================
  if (!user) {
    user = await this.prisma.user.create({
      data: {
        phone: normalizedPhone,
        phoneVerified: true,

        // 🔥 lấy từ Firebase + client
        name: profile?.fullName || 'User',
        email: profile?.email || null,
        address: profile?.address || null,
        password: '',
        role: 'CUSTOMER',
      },
    });

    console.log('🆕 Created user:', user.id);
  } else {
    console.log('👤 Existing user:', user.id);

    // optional: update missing fields
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email || profile?.email || null,
        name: user.name || profile?.fullName || 'User',
        address: user.address || profile?.address || null,
        password : '', 
      },
    });
  }

  const payload = {
    sub: user.id,
    phone: user.phone,
    role: user.role,
  };

  return {
    user,
    access_token: this.jwtService.sign(payload),
  };
}

  /**
   * Debug method to see loyalty points calculation
   */
  async debugLoyaltyPoints(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        status: true,
        usedPoint: true,
        earnedPoint: true,
      },
    });

    let totalLoyaltyPoints = 0;
    const breakdown: any[] = [];

    for (const order of orders) {
      let orderContribution = 0;
      
      if (order.status === 'COMPLETED') {
        orderContribution = order.earnedPoint - order.usedPoint;
        breakdown.push({
          orderId: order.id,
          status: order.status,
          earnedPoint: order.earnedPoint,
          usedPoint: order.usedPoint,
          contribution: orderContribution,
          reason: `COMPLETED: +${order.earnedPoint} -${order.usedPoint}`,
        });
      } else if (order.status === 'CANCELLED') {
        orderContribution = order.usedPoint;
        breakdown.push({
          orderId: order.id,
          status: order.status,
          usedPoint: order.usedPoint,
          contribution: orderContribution,
          reason: `CANCELLED: +${order.usedPoint} (hoàn lại)`,
        });
      } else {
        breakdown.push({
          orderId: order.id,
          status: order.status,
          earnedPoint: order.earnedPoint,
          usedPoint: order.usedPoint,
          contribution: 0,
          reason: `${order.status}: Không tính`,
        });
      }

      totalLoyaltyPoints += orderContribution;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        loyaltyPoint: true,
      },
    });

    return {
      userId,
      userStoredLoyaltyPoint: user?.loyaltyPoint,
      calculatedLoyaltyPoints: Math.max(0, totalLoyaltyPoints),
      totalOrders: orders.length,
      breakdown,
    };
  }

  /**
   * Admin function to recalculate earnedPoint for all orders
   * Should only be called once to fix historical data
   */
  async fixAllEarnedPoints() {
    const orders = await this.prisma.order.findMany({
      where: { isDeleted: false },
      include: {
        items: true,
      },
    });

    let fixed = 0;
    let skipped = 0;
    const results: any[] = [];

    for (const order of orders) {
      // Calculate correct earnedPoint from final amount paid (after all discounts)
      const correctEarnedPoint = Math.floor(order.total * 0.1);

      if (order.earnedPoint !== correctEarnedPoint) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: { earnedPoint: correctEarnedPoint },
        });
        
        fixed++;
        results.push({
          orderId: order.id,
          oldEarnedPoint: order.earnedPoint,
          newEarnedPoint: correctEarnedPoint,
          finalAmount: order.total,
          status: 'FIXED',
        });
      } else {
        skipped++;
      }
    }

    return {
      message: 'Fix completed',
      totalOrders: orders.length,
      fixed,
      skipped,
      results: results.slice(0, 10), // Show first 10 changes
    };
  }
}