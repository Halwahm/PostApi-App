/*
  Warnings:

  - You are about to drop the column `isActivated` on the `UserAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "isActivated";
