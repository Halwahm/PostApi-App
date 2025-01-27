/*
  Warnings:

  - The primary key for the `UserAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserAuth" DROP CONSTRAINT "UserAuth_pkey",
ADD CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id", "userId");
