/*
  Warnings:

  - You are about to drop the column `accessToken` on the `UserAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "accessToken";
