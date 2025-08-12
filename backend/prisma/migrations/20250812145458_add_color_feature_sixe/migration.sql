-- CreateEnum
CREATE TYPE "public"."ESize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "public"."EColor" AS ENUM ('RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "colr" "public"."EColor",
ADD COLUMN     "size" "public"."ESize";

-- CreateTable
CREATE TABLE "public"."ProductFeature" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "ProductFeature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductFeature" ADD CONSTRAINT "ProductFeature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
