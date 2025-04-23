/*
  Warnings:

  - You are about to drop the column `categoryId` on the `symbol_category` table. All the data in the column will be lost.
  - You are about to drop the column `symbolId` on the `symbol_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol_id,category_id]` on the table `symbol_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `symbol_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol_id` to the `symbol_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "symbol_category" DROP CONSTRAINT "symbol_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "symbol_category" DROP CONSTRAINT "symbol_category_symbolId_fkey";

-- DropIndex
DROP INDEX "symbol_category_symbolId_categoryId_key";

-- AlterTable
ALTER TABLE "symbol" ADD COLUMN     "dictionary_id" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "symbol_category" DROP COLUMN "categoryId",
DROP COLUMN "symbolId",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "symbol_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "dictionary" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_symbol" (
    "id" SERIAL NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "symbol_id" INTEGER NOT NULL,

    CONSTRAINT "collection_symbol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_symbol_collection_id_symbol_id_key" ON "collection_symbol"("collection_id", "symbol_id");

-- CreateIndex
CREATE UNIQUE INDEX "symbol_category_symbol_id_category_id_key" ON "symbol_category"("symbol_id", "category_id");

-- AddForeignKey
ALTER TABLE "symbol" ADD CONSTRAINT "symbol_dictionary_id_fkey" FOREIGN KEY ("dictionary_id") REFERENCES "dictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_symbol" ADD CONSTRAINT "collection_symbol_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_symbol" ADD CONSTRAINT "collection_symbol_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
