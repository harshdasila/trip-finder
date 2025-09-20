/*
  Warnings:

  - You are about to drop the column `trip_starting_location_geom` on the `tf_trip` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."idx_tf_trip_starting_location_geom";

-- AlterTable
ALTER TABLE "public"."tf_trip" DROP COLUMN "trip_starting_location_geom";
