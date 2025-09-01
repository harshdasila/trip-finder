/*
  Warnings:

  - A unique constraint covering the columns `[cosntant_slug]` on the table `tf_constants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cosntant_slug` to the `tf_constants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."tf_constants_constant_type_key";

-- AlterTable
ALTER TABLE "public"."tf_constants" ADD COLUMN     "cosntant_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tf_constants_cosntant_slug_key" ON "public"."tf_constants"("cosntant_slug");
