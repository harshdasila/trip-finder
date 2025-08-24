/*
  Warnings:

  - Added the required column `user_password` to the `tf_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tf_user" ADD COLUMN     "user_password" TEXT NOT NULL;
