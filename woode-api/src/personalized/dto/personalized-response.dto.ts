import { ApiProperty } from '@nestjs/swagger';

export class PersonalizedProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID sản phẩm',
  })
  productId!: number;

  @ApiProperty({
    example: 'Ghế ăn gỗ sồi Nordic',
    description: 'Tên sản phẩm',
  })
  productName!: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800',
    nullable: true,
    required: false,
    description: 'Ảnh sản phẩm',
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: 2500000,
    description: 'Giá hiện tại của sản phẩm',
  })
  currentPrice!: number;

  @ApiProperty({
    example: 5,
    description: 'Số lần khách hàng đã mua sản phẩm này',
  })
  timesOrdered!: number;

  @ApiProperty({
    example: 8,
    description: 'Tổng số lượng đã mua của sản phẩm này',
  })
  totalQty!: number;

  @ApiProperty({
    example: '2026-04-01T10:20:00.000Z',
    description: 'Thời điểm gần nhất khách hàng mua sản phẩm này',
  })
  lastOrderedAt!: Date;

  @ApiProperty({
    example: 41,
    description: 'Điểm yêu thích được tính từ tần suất, số lượng và độ gần đây',
  })
  favoriteScore!: number;
}

export class ReorderComboItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID sản phẩm',
  })
  productId!: number;

  @ApiProperty({
    example: 'Ghế ăn gỗ sồi Nordic',
    description: 'Tên sản phẩm trong đơn hàng',
  })
  productName!: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng sản phẩm trong đơn hàng',
  })
  quantity!: number;

  @ApiProperty({
    example: 2500000,
    description: 'Giá gốc sản phẩm tại thời điểm đặt hàng',
  })
  basePrice!: number;
}

export class ReorderComboDto {
  @ApiProperty({
    example: 101,
    description: 'ID đơn hàng cũ có thể dùng để mua lại',
  })
  orderId!: number;

  @ApiProperty({
    example: '2026-04-01T10:20:00.000Z',
    description: 'Ngày tạo đơn hàng',
  })
  createdAt!: Date;

  @ApiProperty({
    example: 6700000,
    description: 'Tổng giá trị đơn hàng',
  })
  total!: number;

  @ApiProperty({
    type: [ReorderComboItemDto],
    description: 'Danh sách sản phẩm trong đơn để user có thể mua lại nhanh',
  })
  items!: ReorderComboItemDto[];
}

export class PersonalizedResponseDto {
  @ApiProperty({
    type: [PersonalizedProductDto],
    description:
      'Danh sách sản phẩm được xếp hạng yêu thích nhất của khách hàng',
  })
  favorites!: PersonalizedProductDto[];

  @ApiProperty({
    type: [PersonalizedProductDto],
    description: 'Danh sách sản phẩm khách hàng đã mua gần đây',
  })
  recentlyOrdered!: PersonalizedProductDto[];

  @ApiProperty({
    type: [PersonalizedProductDto],
    description: 'Danh sách sản phẩm khách hàng mua thường xuyên',
  })
  frequentlyOrdered!: PersonalizedProductDto[];

  @ApiProperty({
    type: [ReorderComboDto],
    description: 'Danh sách các đơn gần đây để khách hàng có thể mua lại nhanh',
  })
  reorderCombos!: ReorderComboDto[];
}
