/*
  Warnings:

  - You are about to drop the column `profileId` on the `Shortcut` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `TaskHistory` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shortcut" DROP CONSTRAINT "Shortcut_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_profileId_fkey";

-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_profileId_fkey";

-- AlterTable
ALTER TABLE "Shortcut" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskHistory" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortcut" ADD CONSTRAINT "Shortcut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
