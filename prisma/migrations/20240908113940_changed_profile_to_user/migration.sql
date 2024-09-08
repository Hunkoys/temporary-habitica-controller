/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shortcut" DROP CONSTRAINT "Shortcut_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_profileId_fkey";

-- DropForeignKey
ALTER TABLE "TaskHistory" DROP CONSTRAINT "TaskHistory_profileId_fkey";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "habiticaUserId" TEXT NOT NULL,
    "habiticaApiKey" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_habiticaUserId_key" ON "User"("habiticaUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_habiticaApiKey_key" ON "User"("habiticaApiKey");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shortcut" ADD CONSTRAINT "Shortcut_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
