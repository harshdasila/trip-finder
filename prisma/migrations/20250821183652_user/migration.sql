/*
  Warnings:

  - Made the column `user_name` on table `tf_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."tf_user" ALTER COLUMN "user_name" SET NOT NULL;
