/*
  Warnings:

  - You are about to drop the column `numberOfActiveSessions` on the `UserAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "numberOfActiveSessions",
ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ip" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isTokenActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAgent" TEXT NOT NULL DEFAULT '';
