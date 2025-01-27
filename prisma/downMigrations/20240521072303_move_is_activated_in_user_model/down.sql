-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActivated";

-- AlterTable
ALTER TABLE "UserAuth" DROP CONSTRAINT "UserAuth_pkey",
ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT true,
ADD CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id", "userId");
