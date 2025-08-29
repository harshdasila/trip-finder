/*
  Warnings:

  - Added the required column `user_password` to the `tf_user` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_name` on table `tf_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."tf_user" ADD COLUMN     "user_password" TEXT NOT NULL,
ALTER COLUMN "user_name" SET NOT NULL;
