/*
  Warnings:

  - You are about to drop the `ProductCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductCollection" DROP CONSTRAINT "ProductCollection_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCollection" DROP CONSTRAINT "ProductCollection_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "collectionId" INTEGER;

-- DropTable
DROP TABLE "public"."ProductCollection";

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
