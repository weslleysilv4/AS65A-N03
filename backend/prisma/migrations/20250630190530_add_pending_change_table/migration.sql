/*
  Warnings:

  - You are about to drop the `NewsCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('CREATE', 'UPDATE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "NewsCategory" DROP CONSTRAINT "NewsCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "NewsCategory" DROP CONSTRAINT "NewsCategory_newsId_fkey";

-- DropIndex
DROP INDEX "news_search_vector_idx";

-- DropTable
DROP TABLE "NewsCategory";

-- CreateTable
CREATE TABLE "PendingChange" (
    "id" TEXT NOT NULL,
    "type" "ChangeType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "content" JSONB NOT NULL,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newsId" TEXT,
    "authorId" TEXT NOT NULL,
    "reviewerId" TEXT,

    CONSTRAINT "PendingChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToNews" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToNews_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToNews_B_index" ON "_CategoryToNews"("B");

-- AddForeignKey
ALTER TABLE "PendingChange" ADD CONSTRAINT "PendingChange_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingChange" ADD CONSTRAINT "PendingChange_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingChange" ADD CONSTRAINT "PendingChange_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNews" ADD CONSTRAINT "_CategoryToNews_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNews" ADD CONSTRAINT "_CategoryToNews_B_fkey" FOREIGN KEY ("B") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
