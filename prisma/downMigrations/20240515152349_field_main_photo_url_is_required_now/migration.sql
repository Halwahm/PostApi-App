/*
  Warnings:

  - Made the column `mainPhotoUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "mainPhotoUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT true;
