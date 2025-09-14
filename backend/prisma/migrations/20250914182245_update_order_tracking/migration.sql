/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "trackingNumber";
