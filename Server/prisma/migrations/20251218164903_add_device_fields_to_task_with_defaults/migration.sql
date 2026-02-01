-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "device" TEXT NOT NULL DEFAULT 'PC',
ADD COLUMN     "manufacturer" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "serialNumber" TEXT NOT NULL DEFAULT 'N/A';
