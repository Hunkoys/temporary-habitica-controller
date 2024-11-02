/*
  Warnings:

  - You are about to drop the column `habiticaApiKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `habiticaApiUser` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "habiticaApiKey",
DROP COLUMN "habiticaApiUser",
ADD COLUMN     "habiticaAPI" TEXT NOT NULL DEFAULT '';
