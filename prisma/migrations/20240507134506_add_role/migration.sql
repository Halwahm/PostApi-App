-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Basic', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Basic';
