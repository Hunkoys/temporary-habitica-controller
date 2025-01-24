/*
  Warnings:

  - You are about to drop the column `egoId` on the `Stat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stat" DROP CONSTRAINT "Stat_egoId_fkey";

-- AlterTable
ALTER TABLE "Stat" DROP COLUMN "egoId",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "value" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "_EgoToStat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EgoToStat_AB_unique" ON "_EgoToStat"("A", "B");

-- CreateIndex
CREATE INDEX "_EgoToStat_B_index" ON "_EgoToStat"("B");

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EgoToStat" ADD CONSTRAINT "_EgoToStat_A_fkey" FOREIGN KEY ("A") REFERENCES "Ego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EgoToStat" ADD CONSTRAINT "_EgoToStat_B_fkey" FOREIGN KEY ("B") REFERENCES "Stat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
