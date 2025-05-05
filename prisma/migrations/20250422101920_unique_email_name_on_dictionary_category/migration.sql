/*
  Warnings:

  - A unique constraint covering the columns `[email,name]` on the table `collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,name]` on the table `dictionary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "collection_email_name_key" ON "collection"("email", "name");

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_email_name_key" ON "dictionary"("email", "name");
