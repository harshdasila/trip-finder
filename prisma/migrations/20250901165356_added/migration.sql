-- CreateTable
CREATE TABLE "public"."tf_constants" (
    "constant_id" SERIAL NOT NULL,
    "constant_type" TEXT NOT NULL,
    "constant_value" INTEGER NOT NULL,
    "constant_max_limit" INTEGER NOT NULL,
    "constant_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "constant_updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tf_constants_constant_id_key" ON "public"."tf_constants"("constant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tf_constants_constant_type_key" ON "public"."tf_constants"("constant_type");
