-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_technicianId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "technicianId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
