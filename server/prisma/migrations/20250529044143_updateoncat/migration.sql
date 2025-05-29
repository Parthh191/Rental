/*
  Warnings:

  - You are about to drop the column `isFeatured` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Item` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "isFeatured",
DROP COLUMN "isVerified",
DROP COLUMN "tags",
ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
