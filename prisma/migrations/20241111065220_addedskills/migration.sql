/*
  Warnings:

  - You are about to drop the `Dog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dog";

-- CreateTable
CREATE TABLE "Skill" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,
    "target" TEXT NOT NULL,
    "repeat" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("name","userId")
);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
