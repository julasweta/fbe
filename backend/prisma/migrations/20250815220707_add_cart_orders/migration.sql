/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId,color,size]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "public"."CartItem_cartId_productId_key";

-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."CartItem" ADD COLUMN     "color" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceSale" DOUBLE PRECISION,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "guestAddress" TEXT,
ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "novaPostBranch" TEXT,
ADD COLUMN     "novaPostCity" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_color_size_key" ON "public"."CartItem"("cartId", "productId", "color", "size");

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
