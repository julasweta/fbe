-- AlterTable
ALTER TABLE "public"."ProductImage" ADD COLUMN     "variantId" INTEGER;

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" SERIAL NOT NULL,
    "color" "public"."EColor" NOT NULL,
    "sizes" "public"."ESize"[],
    "price" DOUBLE PRECISION,
    "priceSale" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
