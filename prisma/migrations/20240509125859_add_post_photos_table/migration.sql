/*
  Warnings:

  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image",
ADD COLUMN     "mainPhotoUrl" TEXT;

-- CreateTable
CREATE TABLE "PostPhotos" (
    "postId" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,

    CONSTRAINT "PostPhotos_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "PostPhotos" ADD CONSTRAINT "PostPhotos_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
