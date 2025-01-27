/*
  Warnings:

  - Made the column `isUser` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- ALTER TABLE "User" ALTER COLUMN "isUser" SET NOT NULL,
-- ALTER COLUMN "isUser" SET DEFAULT true;
ALTER TABLE "User" DROP COLUMN "isUser";