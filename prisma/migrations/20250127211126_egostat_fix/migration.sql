/*
  Warnings:

  - The primary key for the `EgoStat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EgoStat` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Stat_userId_title_key";

-- AlterTable
ALTER TABLE "EgoStat" DROP CONSTRAINT "EgoStat_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "EgoStat_pkey" PRIMARY KEY ("egoId", "statId");
