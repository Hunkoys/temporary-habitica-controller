/*
  Warnings:

  - You are about to drop the column `habiticaAPI` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "habiticaAPI",
ADD COLUMN     "habiticaKeys" TEXT NOT NULL DEFAULT '';
