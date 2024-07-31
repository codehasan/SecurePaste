/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `Paste` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `Paste` table. All the data in the column will be lost.
  - You are about to drop the column `commentsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pastesCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PasteVisit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasteVisit" DROP CONSTRAINT "PasteVisit_pasteId_fkey";

-- DropForeignKey
ALTER TABLE "PasteVisit" DROP CONSTRAINT "PasteVisit_userId_fkey";

-- AlterTable
ALTER TABLE "Paste" DROP COLUMN "commentsCount",
DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "commentsCount",
DROP COLUMN "pastesCount";

-- DropTable
DROP TABLE "PasteVisit";
