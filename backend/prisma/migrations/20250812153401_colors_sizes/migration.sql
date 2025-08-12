-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "colors" "public"."EColor"[] DEFAULT ARRAY[]::"public"."EColor"[],
ADD COLUMN     "sizes" "public"."ESize"[] DEFAULT ARRAY[]::"public"."ESize"[];
