/*
  Warnings:

  - You are about to drop the column `habiticaUserId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habiticaApiUser]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_habiticaUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "habiticaUserId",
ADD COLUMN     "habiticaApiUser" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_habiticaApiUser_key" ON "User"("habiticaApiUser");
