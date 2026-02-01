/*
  Warnings:

  - You are about to drop the column `category` on the `Guide` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Guide` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `Guide` table. All the data in the column will be lost.
  - Added the required column `video` to the `Guide` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Guide" DROP COLUMN "category",
DROP COLUMN "difficulty",
DROP COLUMN "steps",
ADD COLUMN     "video" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "telegram" TEXT;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
