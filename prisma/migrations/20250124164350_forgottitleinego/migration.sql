/*
  Warnings:

  - Added the required column `title` to the `Ego` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ego" ADD COLUMN     "title" TEXT NOT NULL;
