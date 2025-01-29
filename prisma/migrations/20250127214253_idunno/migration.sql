/*
  Warnings:

  - You are about to drop the `EgoStat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,title]` on the table `Ego` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `Stat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EgoStat" DROP CONSTRAINT "EgoStat_egoId_fkey";

-- DropForeignKey
ALTER TABLE "EgoStat" DROP CONSTRAINT "EgoStat_statId_fkey";

-- DropTable
DROP TABLE "EgoStat";

-- CreateIndex
CREATE UNIQUE INDEX "Ego_userId_title_key" ON "Ego"("userId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_userId_title_key" ON "Stat"("userId", "title");
