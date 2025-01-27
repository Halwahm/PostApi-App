-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActivated";

-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "host",
DROP COLUMN "ip",
DROP COLUMN "isTokenActive",
DROP COLUMN "userAgent",
ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "numberOfActiveSessions" INTEGER NOT NULL DEFAULT 0;

