/*
  Warnings:

  - A unique constraint covering the columns `[name_es]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_eu]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_es]` on the table `symbol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_eu]` on the table `symbol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "category_name_es_key" ON "category"("name_es");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_eu_key" ON "category"("name_eu");

-- CreateIndex
CREATE UNIQUE INDEX "symbol_name_es_key" ON "symbol"("name_es");

-- CreateIndex
CREATE UNIQUE INDEX "symbol_name_eu_key" ON "symbol"("name_eu");
