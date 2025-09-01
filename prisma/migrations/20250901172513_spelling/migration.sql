/*
  Warnings:

  - You are about to drop the column `cosntant_slug` on the `tf_constants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[constant_slug]` on the table `tf_constants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `constant_slug` to the `tf_constants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."tf_constants_cosntant_slug_key";

-- AlterTable
ALTER TABLE "public"."tf_constants" DROP COLUMN "cosntant_slug",
ADD COLUMN     "constant_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tf_constants_constant_slug_key" ON "public"."tf_constants"("constant_slug");
