/*
  Warnings:

  - A unique constraint covering the columns `[user_google_id]` on the table `tf_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."tf_user" ADD COLUMN     "user_google_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tf_user_user_google_id_key" ON "public"."tf_user"("user_google_id");
