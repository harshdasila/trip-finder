/*
  Warnings:

  - The primary key for the `_trip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tf_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."_trip" DROP CONSTRAINT "_trip_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."tf_request" DROP CONSTRAINT "tf_request_request_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tf_trip" DROP CONSTRAINT "tf_trip_trip_owner_id_fkey";

-- AlterTable
ALTER TABLE "public"."_trip" DROP CONSTRAINT "_trip_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_trip_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."tf_request" ALTER COLUMN "request_user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."tf_trip" ALTER COLUMN "trip_owner_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."tf_user" DROP CONSTRAINT "tf_user_pkey",
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tf_user_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "tf_user_user_id_seq";

-- AddForeignKey
ALTER TABLE "public"."tf_trip" ADD CONSTRAINT "tf_trip_trip_owner_id_fkey" FOREIGN KEY ("trip_owner_id") REFERENCES "public"."tf_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tf_request" ADD CONSTRAINT "tf_request_request_user_id_fkey" FOREIGN KEY ("request_user_id") REFERENCES "public"."tf_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_trip" ADD CONSTRAINT "_trip_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tf_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
