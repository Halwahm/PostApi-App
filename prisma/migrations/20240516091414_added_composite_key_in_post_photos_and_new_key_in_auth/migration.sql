/*
  Warnings:

  - The primary key for the `PostPhotos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `UserAuth` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "PostPhotos" DROP CONSTRAINT "PostPhotos_pkey",
ADD CONSTRAINT "PostPhotos_pkey" PRIMARY KEY ("postId", "photoPath");

-- AlterTable
ALTER TABLE "UserAuth" DROP CONSTRAINT "UserAuth_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "numberOfActiveSessions" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id");
