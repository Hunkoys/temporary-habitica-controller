/*
  Warnings:

  - Made the column `userId` on table `Stat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_userId_fkey";

-- AlterTable
ALTER TABLE "Stat" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "EgoStat" (
    "id" TEXT NOT NULL,
    "egoId" TEXT NOT NULL,
    "statId" TEXT NOT NULL,

    CONSTRAINT "EgoStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EgoStat" ADD CONSTRAINT "EgoStat_egoId_fkey" FOREIGN KEY ("egoId") REFERENCES "Ego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EgoStat" ADD CONSTRAINT "EgoStat_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
