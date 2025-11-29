import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ExcelRow } from './dto/excel.dto';
import * as XLSX from 'xlsx';
import { EColor, ESize } from '@prisma/client';
import { Response } from 'express';

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
                textEn: f.textEn?.trim() || '',
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
              order: img.order ?? 1,
            })),
          });
        }
      }
    }

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

    if (translations && translations.length > 0) {
      await this.prisma.productTranslation.deleteMany({
        where: { productId: id },
      });

      await this.prisma.productTranslation.createMany({
        data: translations.map((t) => ({
          name: t.name || '',
          description: t.description ?? null,
          languageId: t.languageId || 1,
          productId: id,
        })),
      });
    }

    if (features && features.length > 0) {
      await this.prisma.productFeature.deleteMany({
        where: { productId: id },
      });

      await this.prisma.productFeature.createMany({
        data: features.map((f) => ({
          text: f.text || '',
          textEn: f.textEn?.trim() || '',
          order: f.order ?? null,
          productId: id,
        })),
      });
    }

    if (variants) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      await this.prisma.productVariant.deleteMany({ where: { productId: id } });

      if (variants.length > 0) {
        const validVariants = variants.filter((v) => v.color);

        if (validVariants.length > 0) {
          const createdVariants = await Promise.all(
            validVariants.map((v) =>
              this.prisma.productVariant.create({
                data: {
                  product: { connect: { id } },
                  color: v.color!,
                  sizes: v.sizes || [],
                  price: v.price ?? null,
                  priceSale: v.priceSale ?? null,
                  stock: v.stock ?? 0,
                  description: v.description ?? null,
                },
              }),
            ),
          );

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
                  order: img.order ?? 1,
                })),
              });
            }
          }
        }
      }
    }

    return this.prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  // DELETE
  async remove(id: number) {
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
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: ExcelRow[] = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

      const arraysEqualIgnoreOrder = (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((v, i) => v === sortedB[i]);
      };

      for (const [index, row] of rows.entries()) {
        console.log(`\nProcessing row ${index + 1}:`, row);

        const sku = String(row.sku);

        const variantData = {
          color: row.variantColor as EColor,
          sizes:
            row.variantSizes?.split(',').map((s) => s.trim() as ESize) || [],
          stock: Number(row.stock ?? 0),
          price: Number(row.price),
          priceSale: row.priceSale ? Number(row.priceSale) : null,
          description: row.description,
          variantDescription: row.variantDescription,
          images: row.variantImages
            ? row.variantImages
                .split(/\s*\|\s*/)
                .map((u) => u.trim())
                .filter((u) => /^https?:\/\//i.test(u))
                .map((u) => ({ url: u, altText: null }))
            : [],
        };

        let product = await this.prisma.product.findUnique({
          where: { sku },
          include: {
            variants: { include: { images: true } },
            translations: true,
            features: true,
          },
        });

        if (!product) {
          console.log('Product does not exist. Creating new product...');
          try {
            product = await this.prisma.product.create({
              data: {
                sku,
                price: 0,
                priceSale: 0,
                category: row.categoryId
                  ? { connect: { id: Number(row.categoryId) } }
                  : undefined,
                collection: row.collectionId
                  ? { connect: { id: Number(row.collectionId) } }
                  : undefined,
                translations: row.name
                  ? {
                      create: [
                        {
                          name: row.name,
                          description: row.description || null,
                          language: { connect: { id: 1 } },
                        },
                      ],
                    }
                  : undefined,
                features: row.features
                  ? {
                      create: row.features.split('|').map((feature, index) => ({
                        text: feature.trim(),
                        textEn: row.featuresEn?.split('|')[index]?.trim() || '',
                        order: index + 1,
                      })),
                    }
                  : undefined,
                variants: {
                  create: [
                    {
                      color: variantData.color,
                      sizes: variantData.sizes,
                      price: variantData.price,
                      priceSale: variantData.priceSale,
                      stock: variantData.stock,
                      description: variantData.variantDescription,
                    },
                  ],
                },
              },
              include: {
                variants: { include: { images: true } },
                translations: true,
                features: true,
              },
            });
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
          console.log('Product exists. Updating...');
          try {
            product = await this.prisma.product.update({
              where: { id: product.id },
              data: {
                category: row.categoryId
                  ? { connect: { id: Number(row.categoryId) } }
                  : undefined,
                collection: row.collectionId
                  ? { connect: { id: Number(row.collectionId) } }
                  : undefined,
                translations: row.name
                  ? {
                      upsert: {
                        where: {
                          productId_languageId: {
                            productId: product.id,
                            languageId: 1,
                          },
                        },
                        update: {
                          name: row.name,
                          description: row.description || null,
                        },
                        create: {
                          name: row.name,
                          description: row.description || null,
                          language: { connect: { id: 1 } },
                        },
                      },
                    }
                  : undefined,
                features: row.features
                  ? {
                      deleteMany: {},
                      create: row.features.split('|').map((feature, index) => ({
                        text: feature.trim(),
                        textEn: row.featuresEn?.split('|')[index]?.trim() || '',
                        order: index + 1,
                      })),
                    }
                  : undefined,
              },
              include: {
                variants: { include: { images: true } },
                translations: true,
                features: true,
              },
            });
            console.log('Updated product:', product.id);
          } catch (error) {
            console.error('Error updating product:', error);
          }
        }

        if (!product) continue;

        let existingVariant = product.variants.find(
          (v) =>
            v.color === variantData.color &&
            arraysEqualIgnoreOrder(v.sizes, variantData.sizes),
        );

        if (existingVariant) {
          console.log('Updating existing variant:', existingVariant.id);
          try {
            existingVariant = await this.prisma.productVariant.update({
              where: { id: existingVariant.id },
              data: {
                stock: variantData.stock,
                price: variantData.price,
                priceSale: variantData.priceSale,
                description: variantData.variantDescription,
              },
              include: { images: true },
            });
          } catch (error) {
            console.error('Error updating variant:', error);
          }
        } else {
          console.log('Creating new variant for product:', sku);
          try {
            existingVariant = await this.prisma.productVariant.create({
              data: {
                productId: product.id,
                color: variantData.color,
                sizes: variantData.sizes,
                price: variantData.price,
                priceSale: variantData.priceSale,
                stock: variantData.stock,
                description: variantData.variantDescription,
              },
              include: { images: true },
            });
            console.log('Created variant id:', existingVariant.id);
          } catch (error) {
            console.error('Error creating variant:', error);
            continue;
          }
        }

        if (variantData.images.length > 0) {
          try {
            const existingImageUrls =
              existingVariant.images?.map((img) => img.url) || [];
            const newImages = variantData.images.filter(
              (img) => !existingImageUrls.includes(img.url),
            );

            if (newImages.length > 0) {
              await this.prisma.productImage.createMany({
                data: newImages.map((img) => ({
                  url: img.url,
                  altText: img.altText,
                  variantId: existingVariant.id,
                  productId: product.id,
                })),
              });
              console.log('Added new images for variant');
            }
          } catch (error) {
            console.error('Error creating images:', error);
          }
        }
      }

      console.log('\nImport finished successfully!');

      try {
        const products = await this.prisma.product.findMany({
          include: { variants: true },
        });

        for (const product of products) {
          if (product.variants.length > 0) {
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
                data: { price: minPrice, priceSale: minSalePrice },
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
      throw error;
    }
  }



  async exportProductsToExcel(res: Response) {


    const products = await this.prisma.product.findMany({
      include: {
        variants: { include: { images: true } },
        translations: true,
        features: true,
        category: true,
        collection: true,
      },
    });

    const rows = products.flatMap((product) =>
      product.variants.map((variant) => ({
        sku: product.sku,
        name: product.translations[0]?.name || '',
        description: product.translations[0]?.description || '',
        price: variant.price || product.price,
        priceSale: variant.priceSale || product.priceSale,
        nameCategory: product.category?.name || '',
        categoryId: product.categoryId,
        variantDescription: variant.description || '',
        nameCollection: product.collection?.name || '',
        collectionId: product.collectionId,
        sizes: variant.sizes.join(','),
        colors: variant.color,
        images: variant.images.map((img) => img.url).join(' | '),
        features: product.features.map((f) => f.text).join(' | '),
        featuresEn: product.features.map((f) => f.textEn || '').join(' | '),
        variantColor: variant.color,
        variantSizes: variant.sizes.join(','),
        variantImages: variant.images.map((img) => img.url).join(' | '),
        stock: variant.stock,
      })),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="products.xlsx"',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  async exportProductsToGoogle(res: Response) {
    const categoryMapping = {
      Tops: 'Apparel & Accessories > Clothing > Shirts & Tops',
      Dress: 'Apparel & Accessories > Clothing > Dresses',
      Bottoms: 'Apparel & Accessories > Clothing > Pants',
      Shortdress: 'Apparel & Accessories > Clothing > Dresses',
      New: 'Apparel & Accessories > Clothing',
    };

    
    const products = await this.prisma.product.findMany({
      include: {
        variants: { include: { images: true } },
        translations: true,
        category: true,
        collection: true,
        images: true,
      },
    });

    const rows = products.flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.sizes.map((size) => {
          const title = product.translations[0]?.name || '';
          const description = product.translations[0]?.description || '';
          const price = (variant.price || product.price).toFixed(2) + ' UAH';
          const salePrice = variant.priceSale
            ? variant.priceSale.toFixed(2) + ' UAH'
            : product.priceSale
              ? product.priceSale.toFixed(2) + ' UAH'
              : undefined;

          // Генерація тегів
          const words = title.split(/\s+/);
          const tags = [
            ...words,
            ...words.map((w) => `${w} FBE`),
          ];

          return {
            id: product.id,
            item_group_id: product.id,
            title,
            description,
            link: `https://fbe.pp.ua/product/${product.id}/`,
            image_link:
              variant.images[0]?.url ||
              product.images[0]?.url ||
              'https://fbe.pp.ua/default.jpg',
            additional_image_link: variant.images
              .map((img) => img.url)
              .slice(1)
              .join(','),
            price,
            sale_price: salePrice,
            availability: variant.stock > 0 ? 'in stock' : 'out of stock',
            condition: 'new',
            brand: 'FBE',
            gender: "female",
            "material": "Спандекс",
            "size_type": "regular",
            "size_system": "EU",
            "included_destination": "Free_listings, Free_local_listings",
            google_product_category: product.category?.name
              ? categoryMapping[product.category.name]
              : "Одяг",
            product_type: product.collection?.name || '',
            color: variant.color,
            size,
            tags: tags.join(','), 
            coumtry: 'UA'
          };
        }),
      ),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="google_products.xlsx"',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }




}
