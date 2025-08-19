-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."tf_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tf_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tf_trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "minBudget" INTEGER NOT NULL,
    "maxBudget" INTEGER NOT NULL,
    "description" TEXT,
    "maxPeople" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tf_trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tf_request" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tripId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tf_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Trip" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Trip_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tf_users_email_key" ON "public"."tf_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tf_request_userId_tripId_key" ON "public"."tf_request"("userId", "tripId");

-- CreateIndex
CREATE INDEX "_Trip_B_index" ON "public"."_Trip"("B");

-- AddForeignKey
ALTER TABLE "public"."tf_trip" ADD CONSTRAINT "tf_trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."tf_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tf_request" ADD CONSTRAINT "tf_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tf_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tf_request" ADD CONSTRAINT "tf_request_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."tf_trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Trip" ADD CONSTRAINT "_Trip_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."tf_trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Trip" ADD CONSTRAINT "_Trip_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tf_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
