-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpiry" TIMESTAMP(3);
