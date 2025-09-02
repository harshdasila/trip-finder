/*
  Warnings:

  - Added the required column `trip_location_lat` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_location_lon` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_starting_location` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_starting_location_lat` to the `tf_trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_starting_location_lon` to the `tf_trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tf_trip" ADD COLUMN     "trip_location_lat" TEXT NOT NULL,
ADD COLUMN     "trip_location_lon" TEXT NOT NULL,
ADD COLUMN     "trip_starting_location" TEXT NOT NULL,
ADD COLUMN     "trip_starting_location_lat" TEXT NOT NULL,
ADD COLUMN     "trip_starting_location_lon" TEXT NOT NULL;
