-- CreateTable
CREATE TABLE "symbol" (
    "id" SERIAL NOT NULL,
    "json_data" JSONB NOT NULL,
    "name_es" TEXT,
    "name_eu" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name_es" TEXT,
    "name_eu" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbol_category" (
    "id" SERIAL NOT NULL,
    "symbolId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "symbol_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "symbol_category_symbolId_categoryId_key" ON "symbol_category"("symbolId", "categoryId");

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
