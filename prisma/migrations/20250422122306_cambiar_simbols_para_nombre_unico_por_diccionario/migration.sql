/*
  Warnings:

  - A unique constraint covering the columns `[name_es,dictionary_id]` on the table `symbol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_eu,dictionary_id]` on the table `symbol` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "symbol_name_es_key";

-- DropIndex
DROP INDEX "symbol_name_eu_key";

-- CreateIndex
CREATE UNIQUE INDEX "symbol_name_es_dictionary_id_key" ON "symbol"("name_es", "dictionary_id");

-- CreateIndex
CREATE UNIQUE INDEX "symbol_name_eu_dictionary_id_key" ON "symbol"("name_eu", "dictionary_id");
