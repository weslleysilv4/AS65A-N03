/*
  Warnings:

  - You are about to drop the column `externalLinks` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `videos` on the `News` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'EXTERNAL_LINK');

-- AlterTable
ALTER TABLE "News" DROP COLUMN "externalLinks",
DROP COLUMN "images",
DROP COLUMN "videos";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "alt" TEXT,
    "title" TEXT,
    "description" TEXT,
    "caption" TEXT,
    "copyright" TEXT,
    "type" "MediaType" NOT NULL,
    "order" INTEGER NOT NULL,
    "newsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_newsId_idx" ON "Media"("newsId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
