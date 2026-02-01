/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ADD COLUMN     "statusForAdmin" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
ADD COLUMN     "statusForMember" "MessageStatus" NOT NULL DEFAULT 'UNREAD';
