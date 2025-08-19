/*
  Warnings:

  - The primary key for the `tf_request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tf_request` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tf_request` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `tf_request` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tf_request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tf_request` table. All the data in the column will be lost.
  - The primary key for the `tf_trip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `maxBudget` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `maxPeople` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `minBudget` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tf_trip` table. All the data in the column will be lost.
  - You are about to drop the `_Trip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tf_users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[request_user_id,trip_id]` on the table `tf_request` will be added. If there are existing duplicate values, this will fail.
  - The required column `request_id` was added to the `tf_request` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `request_updated_at` to the `tf_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_user_id` to the `tf_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_id` to the `tf_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_end_date` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - The required column `trip_id` was added to the `tf_trip` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `trip_location` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_max_budget` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_max_people` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_min_budget` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_owner_id` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_start_date` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_title` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_updated_at` to the `tf_trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_Trip" DROP CONSTRAINT "_Trip_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_Trip" DROP CONSTRAINT "_Trip_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."tf_request" DROP CONSTRAINT "tf_request_tripId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tf_request" DROP CONSTRAINT "tf_request_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tf_trip" DROP CONSTRAINT "tf_trip_ownerId_fkey";

-- DropIndex
DROP INDEX "public"."tf_request_userId_tripId_key";

-- AlterTable
ALTER TABLE "public"."tf_request" DROP CONSTRAINT "tf_request_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "tripId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "request_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "request_id" TEXT NOT NULL,
ADD COLUMN     "request_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "request_user_id" INTEGER NOT NULL,
ADD COLUMN     "trip_id" TEXT NOT NULL,
ADD CONSTRAINT "tf_request_pkey" PRIMARY KEY ("request_id");

-- AlterTable
ALTER TABLE "public"."tf_trip" DROP CONSTRAINT "tf_trip_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "id",
DROP COLUMN "location",
DROP COLUMN "maxBudget",
DROP COLUMN "maxPeople",
DROP COLUMN "minBudget",
DROP COLUMN "ownerId",
DROP COLUMN "startDate",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "trip_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trip_description" TEXT,
ADD COLUMN     "trip_end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trip_id" TEXT NOT NULL,
ADD COLUMN     "trip_location" TEXT NOT NULL,
ADD COLUMN     "trip_max_budget" INTEGER NOT NULL,
ADD COLUMN     "trip_max_people" INTEGER NOT NULL,
ADD COLUMN     "trip_min_budget" INTEGER NOT NULL,
ADD COLUMN     "trip_owner_id" INTEGER NOT NULL,
ADD COLUMN     "trip_start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trip_title" TEXT NOT NULL,
ADD COLUMN     "trip_updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "tf_trip_pkey" PRIMARY KEY ("trip_id");

-- DropTable
DROP TABLE "public"."_Trip";

-- DropTable
DROP TABLE "public"."tf_users";

-- CreateTable
CREATE TABLE "public"."tf_user" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT,
    "user_email" TEXT NOT NULL,
    "user_image" TEXT,
    "user_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tf_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."_trip" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_trip_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tf_user_user_email_key" ON "public"."tf_user"("user_email");

-- CreateIndex
CREATE INDEX "_trip_B_index" ON "public"."_trip"("B");

-- CreateIndex
CREATE UNIQUE INDEX "tf_request_request_user_id_trip_id_key" ON "public"."tf_request"("request_user_id", "trip_id");

-- AddForeignKey
ALTER TABLE "public"."tf_trip" ADD CONSTRAINT "tf_trip_trip_owner_id_fkey" FOREIGN KEY ("trip_owner_id") REFERENCES "public"."tf_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tf_request" ADD CONSTRAINT "tf_request_request_user_id_fkey" FOREIGN KEY ("request_user_id") REFERENCES "public"."tf_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tf_request" ADD CONSTRAINT "tf_request_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."tf_trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_trip" ADD CONSTRAINT "_trip_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."tf_trip"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_trip" ADD CONSTRAINT "_trip_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tf_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
