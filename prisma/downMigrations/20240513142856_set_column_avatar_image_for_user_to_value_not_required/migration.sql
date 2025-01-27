-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT true;
