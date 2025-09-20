-- AlterTable
ALTER TABLE "public"."tf_trip" ADD COLUMN     "trip_starting_location_geom" geometry;

-- AlterTable
ALTER TABLE "public"."tf_user" ADD COLUMN     "user_location_lat" TEXT,
ADD COLUMN     "user_location_lon" TEXT;

-- CreateIndex
CREATE INDEX "idx_tf_trip_starting_location_geom" ON "public"."tf_trip" USING GIST ("trip_starting_location_geom");
