/*
  Warnings:

  - You are about to drop the column `technicianId` on the `Task` table. All the data in the column will be lost.

*/
-- First, update all existing TECHNICIAN roles to MEMBER in the User table
UPDATE "User" SET "role" = 'MEMBER' WHERE "role" = 'TECHNICIAN';

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_technicianId_fkey";

-- AlterTable (rename column instead of drop/add to preserve data)
ALTER TABLE "Task" RENAME COLUMN "technicianId" TO "memberId";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
