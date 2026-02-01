/*
  Warnings:

  - You are about to drop the column `published` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Guide` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "published";

-- AlterTable
ALTER TABLE "Guide" DROP COLUMN "published";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "published";
