/*
  Warnings:

  - You are about to drop the column `category_id` on the `symbol_category` table. All the data in the column will be lost.
  - You are about to drop the column `symbol_id` on the `symbol_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbolId,categoryId]` on the table `symbol_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `symbol_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbolId` to the `symbol_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "symbol_category" DROP CONSTRAINT "symbol_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "symbol_category" DROP CONSTRAINT "symbol_category_symbol_id_fkey";

-- DropIndex
DROP INDEX "symbol_category_symbol_id_category_id_key";

-- AlterTable
ALTER TABLE "symbol_category" DROP COLUMN "category_id",
DROP COLUMN "symbol_id",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "symbolId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "symbol_category_symbolId_categoryId_key" ON "symbol_category"("symbolId", "categoryId");

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbol_category" ADD CONSTRAINT "symbol_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
