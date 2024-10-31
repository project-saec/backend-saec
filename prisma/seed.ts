import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/hashing';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: await hashPassword('12345678'),
      first_name: 'John',
      last_name: 'Doe',
      emailVerified: true,
      role: 'ADMIN',
    },
  });

  const electronicsCategory = await prisma.category.create({
    data: {
      title: 'Electronics',
      description: 'All kinds of electronic products',
      SubCategories: {
        create: [
          {
            title: 'Mobile Phones',
            description: 'Smartphones of all brands',
          },
          {
            title: 'Laptops',
            description: 'Latest and greatest laptops',
          },
        ],
      },
    },
    include: {
      SubCategories: true,
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      title: 'Clothing',
      description: 'Men and Women clothing',
      SubCategories: {
        create: [
          {
            title: "Men's Clothing",
            description: 'Clothing for men',
          },
          {
            title: "Women's Clothing",
            description: 'Clothing for women',
          },
        ],
      },
    },
    include: {
      SubCategories: true,
    },
  });

  const brandApple = await prisma.brand.create({
    data: {
      name: 'Apple',
    },
  });

  const brandNike = await prisma.brand.create({
    data: {
      name: 'Nike',
    },
  });

  const sizeAttributeType = await prisma.attributeType.create({
    data: {
      name: 'Size',
      values: {
        create: [
          { value: 'S' },
          { value: 'M' },
          { value: 'L' },
          { value: 'XL' },
        ],
      },
    },
    include: {
      values: true,
    },
  });

  const colorAttributeType = await prisma.attributeType.create({
    data: {
      name: 'Color',
      values: {
        create: [{ value: 'Red' }, { value: 'Blue' }, { value: 'Green' }],
      },
    },
    include: {
      values: true,
    },
  });

  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 13',
      description: 'Latest Apple iPhone',
      base_price: 799.99,
      categoryId: electronicsCategory.id,
      subCategoryId: electronicsCategory.SubCategories[0].id, // Mobile Phones
      brandId: brandApple.id,
      variants: {
        create: [
          {
            stock: 100,
            price: 799.99,
            attributes: {
              create: [
                {
                  attributeTypeId: sizeAttributeType.id,
                  attributeValueId: sizeAttributeType.values[0].id, // S
                },
                {
                  attributeTypeId: colorAttributeType.id,
                  attributeValueId: colorAttributeType.values[0].id, // Red
                },
              ],
            },
          },
          {
            stock: 200,
            price: 899.99,
            attributes: {
              create: [
                {
                  attributeTypeId: sizeAttributeType.id,
                  attributeValueId: sizeAttributeType.values[1].id, // M
                },
                {
                  attributeTypeId: colorAttributeType.id,
                  attributeValueId: colorAttributeType.values[1].id, // Blue
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  });

  const nikeShirt = await prisma.product.create({
    data: {
      name: 'Nike Shirt',
      description: "Men's Athletic Shirt",
      base_price: 29.99,
      categoryId: clothingCategory.id,
      subCategoryId: clothingCategory.SubCategories[0].id, // Men's Clothing
      brandId: brandNike.id,
      variants: {
        create: [
          {
            stock: 50,
            price: 29.99,
            attributes: {
              create: [
                {
                  attributeTypeId: sizeAttributeType.id,
                  attributeValueId: sizeAttributeType.values[2].id, // L
                },
                {
                  attributeTypeId: colorAttributeType.id,
                  attributeValueId: colorAttributeType.values[2].id, // Green
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  });

  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      totalAmount: 829.99,
      status: 'PENDING',
      orderItems: {
        create: [
          {
            productId: iphone.id,
            variantId: iphone.variants[0].id, // iPhone 13 - S / Red
            quantity: 1,
            price: 799.99,
          },
          {
            productId: nikeShirt.id,
            variantId: nikeShirt.variants[0].id, // Nike Shirt - L / Green
            quantity: 1,
            price: 29.99,
          },
        ],
      },
    },
  });

  console.log('Seeding completed', order1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
