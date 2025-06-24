/*
  Warnings:

  - You are about to drop the column `publicationDate` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "publicationDate",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "videos" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "externalLinks" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "tagsKeywords" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PUBLISHER';
