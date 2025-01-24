/*
  Warnings:

  - A unique constraint covering the columns `[userId,title]` on the table `Stat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stat_userId_title_key" ON "Stat"("userId", "title");
