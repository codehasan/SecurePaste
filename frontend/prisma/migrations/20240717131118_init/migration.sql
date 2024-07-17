-- AlterTable
ALTER TABLE "Paste" ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visitsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pastesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PasteVisit" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "pasteId" TEXT NOT NULL,

    CONSTRAINT "PasteVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasteVisit" ADD CONSTRAINT "PasteVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasteVisit" ADD CONSTRAINT "PasteVisit_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE CASCADE ON UPDATE CASCADE;
