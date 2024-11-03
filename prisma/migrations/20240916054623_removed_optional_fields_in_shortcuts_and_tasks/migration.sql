/*
  Warnings:

  - Made the column `userId` on table `Shortcut` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `TaskHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Shortcut" DROP CONSTRAINT "Shortcut_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_userId_fkey";

-- AlterTable
ALTER TABLE "Shortcut" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TaskHistory" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortcut" ADD CONSTRAINT "Shortcut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
