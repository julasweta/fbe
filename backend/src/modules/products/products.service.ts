import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ExcelRow } from './dto/excel.dto';
import * as XLSX from 'xlsx';
import { EColor, ESize } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateProductDto) {
    const {
      translations,
      features,
      categoryId,
      collectionId,
      variants,
      ...rest
    } = dto;

    // First, create the product with variants (without images)
    const product = await this.prisma.product.create({
      data: {
        ...rest,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        collection: collectionId
          ? { connect: { id: collectionId } }
          : undefined,

        translations: translations
          ? {
              create: translations.map((t) => ({
                name: t.name,
                description: t.description ?? null,
                language: { connect: { id: t.languageId } },
              })),
            }
          : undefined,

        features: features
          ? {
              create: features.map((f) => ({
                text: f.text,
                order: f.order ?? null,
              })),
            }
          : undefined,

        variants: variants
          ? {
              create: variants.map((v) => ({
                color: v.color,
                sizes: v.sizes,
                price: v.price ?? null,
                priceSale: v.priceSale ?? null,
                stock: v.stock ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
      },
    });

    // Then, create images for each variant if they exist
    if (variants && product.variants) {
      for (let i = 0; i < variants.length; i++) {
        const variantDto = variants[i];
        const createdVariant = product.variants[i];

        if (variantDto.images && variantDto.images.length > 0) {
          await this.prisma.productImage.createMany({
            data: variantDto.images.map((img) => ({
              url: img.url,
              altText: img.altText ?? null,
              variantId: createdVariant.id,
              productId: product.id,
            })),
          });
        }
      }
    }

    // Finally, return the complete product with all relations
    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: this.defaultInclude(),
    });
  }

  // LIST
  async findAll(params: {
    limit?: number;
    skip?: number;
    page?: number;
    category?: string;
    collection?: string;
  }) {
    const limit = params.limit ?? 20;
    const offset = params.page ? (params.page - 1) * limit : (params.skip ?? 0);

    const where: any = {};
    if (params.category) where.category = { slug: params.category };
    if (params.collection) where.collection = { slug: params.collection };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip: offset,
        take: limit,
        where,
        include: this.defaultInclude(),
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      count,
      page: params.page || Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(count / limit),
    };
  }

  // GET ONE
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // UPDATE
  async update(id: number, dto: UpdateProductDto) {
    const {
      translations,
      features,
      categoryId,
      collectionId,
      variants,
      ...rest
    } = dto;

    // КРОК 1: оновлюємо сам продукт
    await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        category:
          categoryId !== undefined
            ? categoryId
              ? { connect: { id: categoryId } }
              : { disconnect: true }
            : undefined,
        collection: collectionId
          ? { connect: { id: collectionId } }
          : undefined,
      },
    });

    // КРОК 2: оновлюємо переклади якщо передані
    if (translations && translations.length > 0) {
      // Спочатку видаляємо старі переклади
      await this.prisma.productTranslation.deleteMany({
        where: { productId: id }
      });

      // Створюємо нові переклади
      await this.prisma.productTranslation.createMany({
        data: translations.map((t) => ({
          name: t.name || '',
          description: t.description ?? null,
          languageId: t.languageId || 1,
          productId: id,
        })),
      });
    }

    // КРОК 3: оновлюємо особливості якщо передані
    if (features && features.length > 0) {
      // Спочатку видаляємо старі особливості
      await this.prisma.productFeature.deleteMany({
        where: { productId: id }
      });

      // Створюємо нові особливості
      await this.prisma.productFeature.createMany({
        data: features.map((f) => ({
          text: f.text || '',
          order: f.order ?? null,
          productId: id,
        })),
      });
    }

    // КРОК 4: оновлюємо варіанти якщо передані
    if (variants) {
      // Спочатку чистимо пов'язані зображення і варіанти
      await this.prisma.productImage.deleteMany({
        where: { productId: id }
      });
      await this.prisma.productVariant.deleteMany({
        where: { productId: id }
      });

      // Створюємо нові варіанти (якщо є)
      if (variants.length > 0) {
        // Фільтруємо варіанти з обов'язковими полями
        const validVariants = variants.filter(v => v.color);

        if (validVariants.length > 0) {
          // Створюємо варіанти без зображень спочатку
          const createdVariants = await Promise.all(
            validVariants.map((v) =>
              this.prisma.productVariant.create({
                data: {
                  product: { connect: { id } },
                  color: v.color!, // використовуємо ! оскільки ми відфільтрували
                  sizes: v.sizes || [],
                  price: v.price ?? null,
                  priceSale: v.priceSale ?? null,
                  stock: v.stock ?? 0,
                  description: v.description ?? null,
                },
              }),
            ),
          );

          // Тепер створюємо зображення для варіантів
          for (let i = 0; i < validVariants.length; i++) {
            const variantDto = validVariants[i];
            const createdVariant = createdVariants[i];

            if (variantDto.images && variantDto.images.length > 0) {
              await this.prisma.productImage.createMany({
                data: variantDto.images.map((img: any) => ({
                  url: img.url || '',
                  altText: img.altText ?? null,
                  variantId: createdVariant.id,
                  productId: id,
                })),
              });
            }
          }
        }
      }
    }

    // Повертаємо оновлений продукт з усіма зв'язками
    return this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  // DELETE
  async remove(id: number) {
    // видаляємо залежності у безпечному порядку
    await this.prisma.productImage.deleteMany({ where: { productId: id } });
    await this.prisma.productTranslation.deleteMany({
      where: { productId: id },
    });
    await this.prisma.productFeature.deleteMany({ where: { productId: id } });
    await this.prisma.productVariant.deleteMany({ where: { productId: id } });
    await this.prisma.cartItem.deleteMany({ where: { productId: id } });
    await this.prisma.orderItem.deleteMany({ where: { productId: id } });

    return this.prisma.product.delete({ where: { id } });
  }

  private defaultInclude() {
    return {
      translations: { include: { language: true } },
      features: true,
      category: true,
      collection: true,
      variants: { include: { images: true } },
    };
  }

  async importProductsFromFile(file: Express.Multer.File) {
    try {
      // Читаємо Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: ExcelRow[] = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

      console.log('Excel rows:', rows);

      // Функція для порівняння масивів незалежно від порядку
      const arraysEqualIgnoreOrder = (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((v, i) => v === sortedB[i]);
      };

      for (const [index, row] of rows.entries()) {
        console.log(`\nProcessing row ${index + 1}:`, row);

        // Переконуємося що SKU є рядком
        const sku = String(row.sku);
        console.log('SKU as string:', sku);

        // Перетворюємо ExcelRow на variantData
        const variantData = {
          color: row.variantColor as EColor,
          sizes:
            row.variantSizes?.split(',').map((s) => s.trim() as ESize) || [],
          stock: Number(row.stock ?? row.stock) || 0,
          price: Number(row.price),
          priceSale: row.priceSale ? Number(row.priceSale) : null,
          description: row.description, // для продукту
          variantDescription: row.variantDescription, // для варіанта
          images: row.variantImages
            ? row.variantImages
                .split(/\s*\|\s*/) // ділимо тільки по " | "
                .map((u) => u.trim())
                .filter((u) => /^https?:\/\//i.test(u)) // відсікаємо сміття
                .map((u) => ({ url: u, altText: null }))
            : [],
        };

        console.log('variantData:', variantData);

        // Перевіряємо, чи продукт уже існує
        let product = await this.prisma.product.findUnique({
          where: { sku: sku }, // використовуємо перетворений sku
          include: {
            variants: {
              include: {
                images: true, // Включаємо зображення для перевірки дублікатів
              },
            },
            translations: true, // Включаємо переклади
            features: true, // Включаємо features
          },
        });

        if (!product) {
          console.log('Product does not exist. Creating new product...');
          try {
            const createdProduct = await this.prisma.product.create({
              data: {
                sku: sku,
                price: 0, // Встановлюємо 0 для основного продукту
                priceSale: 0, // Встановлюємо 0 для основного продукту
                // Виправлено підключення категорії та колекції
                category: row.categoryId
                  ? { connect: { id: Number(row.categoryId) } }
                  : undefined,
                collection: row.collectionId
                  ? { connect: { id: Number(row.collectionId) } }
                  : undefined,

                // Додаємо переклади якщо є name
                translations: row.name
                  ? {
                      create: [
                        {
                          name: row.name,
                          description: row.description || null,
                          language: { connect: { id: 1 } }, // languageId = 1
                        },
                      ],
                    }
                  : undefined,

                // Додаємо features якщо є
                features: row.features
                  ? {
                      create: row.features.split(',').map((feature, index) => ({
                        text: feature.trim(),
                        order: index + 1,
                      })),
                    }
                  : undefined,

                variants: {
                  create: [
                    {
                      color: variantData.color,
                      sizes: variantData.sizes,
                      price: variantData.price, // Повертаємо ціни варіантів
                      priceSale: variantData.priceSale, // Повертаємо ціни варіантів
                      stock: variantData.stock,
                      description: variantData.variantDescription,
                    },
                  ],
                },
              },
              include: {
                variants: {
                  include: {
                    images: true,
                  },
                },
                translations: true, // Додаємо translations
                features: true, // Додаємо features
              },
            });
            product = createdProduct;
            console.log(
              'Created product:',
              product.sku,
              'with id:',
              product.id,
            );
          } catch (error) {
            console.error('Error creating product:', error);
            continue;
          }
        } else {
          console.log('Existing product:', product);
          console.log(
            'Row categoryId:',
            row.categoryId,
            'Row collectionId:',
            row.collectionId,
          );

          // Оновлюємо основні поля продукту якщо потрібно
          const updateData: any = {};

          // Додаємо категорію якщо вона є і відрізняється
          if (row.categoryId && product.categoryId !== Number(row.categoryId)) {
            updateData.category = { connect: { id: Number(row.categoryId) } };
            console.log('Will update category to:', row.categoryId);
          }

          // Додаємо колекцію якщо вона є і відрізняється
          if (
            row.collectionId &&
            product.collectionId !== Number(row.collectionId)
          ) {
            updateData.collection = {
              connect: { id: Number(row.collectionId) },
            };
            console.log('Will update collection to:', row.collectionId);
          }

          // Оновлюємо базові поля продукту - НЕ оновлюємо ціни
          // updateData.price = Number(row.price);
          // updateData.priceSale = row.priceSale ? Number(row.priceSale) : null;

          // Додаємо name та description якщо вони є в Excel
          if (row.name) {
            console.log('Row has name:', row.name);
          }
          if (row.description) {
            console.log('Row has description:', row.description);
          }
          if (row.features) {
            console.log('Row has features:', row.features);
          }

          if (Object.keys(updateData).length > 0) {
            try {
              console.log('Updating product with data:', updateData);
              const updatedProduct = await this.prisma.product.update({
                where: { id: product.id },
                data: updateData,
                include: {
                  variants: {
                    include: {
                      images: true,
                    },
                  },
                  translations: true, // Додаємо translations
                  features: true, // Додаємо features
                },
              });
              product = updatedProduct;
              console.log(
                'Product updated successfully. CategoryId:',
                product.categoryId,
                'CollectionId:',
                product.collectionId,
              );
            } catch (error) {
              console.error('Error updating product:', error);
              console.error('Update data that caused error:', updateData);
            }
          } else {
            console.log('No updates needed for product');
          }

          // Додаємо переклади якщо їх немає і є name в Excel
          if (
            product &&
            row.name &&
            (!product.translations || product.translations.length === 0)
          ) {
            try {
              await this.prisma.productTranslation.create({
                data: {
                  name: row.name,
                  description: row.description || null,
                  productId: product.id,
                  languageId: 1,
                },
              });
              console.log('Added translation for product:', sku);
            } catch (error) {
              console.error('Error adding translation:', error);
            }
          }

          // Додаємо features якщо їх немає і є features в Excel
          if (
            product &&
            row.features &&
            (!product.features || product.features.length === 0)
          ) {
            try {
              const featureTexts = row.features.split(',').map((f) => f.trim());
              await this.prisma.productFeature.createMany({
                data: featureTexts.map((text, index) => ({
                  text,
                  order: index + 1,
                  productId: product!.id, // Використовуємо ! так як ми знаємо що product не null
                })),
              });
              console.log('Added features for product:', sku);
            } catch (error) {
              console.error('Error adding features:', error);
            }
          }
        }

        if (!product) {
          console.warn('Product creation failed, skipping row.');
          continue;
        }

        // Перевіряємо чи варіант вже існує
        let existingVariant = product.variants.find(
          (v) =>
            v.color === variantData.color &&
            arraysEqualIgnoreOrder(v.sizes, variantData.sizes),
        );

        if (existingVariant) {
          console.log(
            'Variant already exists, updating stock/price if needed:',
            existingVariant.id,
          );
          try {
            existingVariant = await this.prisma.productVariant.update({
              where: { id: existingVariant.id },
              data: {
                stock: variantData.stock,
                price: variantData.price, // Повертаємо ціни варіантів
                priceSale: variantData.priceSale, // Повертаємо ціни варіантів
              },
              include: {
                images: true,
              },
            });
          } catch (error) {
            console.error('Error updating existing variant:', error);
            continue;
          }
        } else {
          console.log('Creating new variant for product:', sku);
          try {
            existingVariant = await this.prisma.productVariant.create({
              data: {
                productId: product.id,
                color: variantData.color,
                sizes: variantData.sizes,
                price: variantData.price, // Повертаємо ціни варіантів
                priceSale: variantData.priceSale, // Повертаємо ціни варіантів
                stock: variantData.stock,
                description: variantData.variantDescription,
              },
              include: {
                images: true,
              },
            });
            console.log('Created variant id:', existingVariant.id);
          } catch (error) {
            console.error('Error creating new variant:', error);
            continue;
          }
        }

        // Додаємо картинки до варіанту ТІЛЬКИ якщо їх ще немає
        if (variantData.images.length > 0) {
          try {
            // Перевіряємо які зображення вже існують
            const existingImageUrls =
              existingVariant.images?.map((img) => img.url) || [];
            const newImages = variantData.images.filter(
              (img) => !existingImageUrls.includes(img.url),
            );

            if (newImages.length > 0) {
              const createdImages = await this.prisma.productImage.createMany({
                data: newImages.map((img) => ({
                  url: img.url,
                  altText: img.altText,
                  variantId: existingVariant.id,
                  productId: product.id,
                })),
              });
              console.log('Created images:', createdImages);
            } else {
              console.log('All images already exist for this variant');
            }
          } catch (error) {
            console.error('Error creating variant images:', error);
          }
        }
      }

      console.log('\nImport finished successfully!');

      // Додатково: оновлюємо ціни продуктів на основі мінімальних цін варіантів
      try {
        const products = await this.prisma.product.findMany({
          include: {
            variants: true,
          },
        });

        for (const product of products) {
          if (product.variants.length > 0) {
            // Фільтруємо null значення і перетворюємо в числа
            const prices = product.variants
              .map((v) => v.price)
              .filter((p): p is number => p !== null && p > 0);

            const salePrices = product.variants
              .map((v) => v.priceSale)
              .filter((p): p is number => p !== null && p > 0);

            if (prices.length > 0) {
              const minPrice = Math.min(...prices);
              const minSalePrice =
                salePrices.length > 0 ? Math.min(...salePrices) : null;

              await this.prisma.product.update({
                where: { id: product.id },
                data: {
                  price: minPrice,
                  priceSale: minSalePrice,
                },
              });
              console.log(
                `Updated product ${product.sku} base price to ${minPrice}`,
              );
            }
          }
        }
      } catch (error) {
        console.error('Error updating product base prices:', error);
      }
    } catch (error) {
      console.error('Unexpected error during import:', error);
      throw error; // Кидаємо помилку для обробки на верхньому рівні
    }
  }
}
