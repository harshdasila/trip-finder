-- Enable PostGIS extension first
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Then add the geometry column
ALTER TABLE "tf_trip" ADD COLUMN "trip_starting_location_geom" geometry(POINT,4326);

-- Create spatial index
CREATE INDEX "idx_tf_trip_starting_location_geom" ON "tf_trip" USING GIST("trip_starting_location_geom");

-- Populate existing records
UPDATE "tf_trip" 
SET "trip_starting_location_geom" = ST_SetSRID(
    ST_MakePoint(
        CAST("trip_starting_location_lon" AS DOUBLE PRECISION), 
        CAST("trip_starting_location_lat" AS DOUBLE PRECISION)
    ), 
    4326
)
WHERE "trip_starting_location_lat" IS NOT NULL 
  AND "trip_starting_location_lon" IS NOT NULL 
  AND "trip_starting_location_lat" != '' 
  AND "trip_starting_location_lon" != '';