/*
  Warnings:

  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostHashtags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "PostHashtags" DROP CONSTRAINT "PostHashtags_pkey",
ADD CONSTRAINT "PostHashtags_pkey" PRIMARY KEY ("postId", "hashtagId");

-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "accessToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
