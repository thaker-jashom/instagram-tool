-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('YOUTUBE', 'INSTAGRAM');

-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "platform" "Platform" NOT NULL,
    "followerCount" INTEGER NOT NULL,
    "engagementRate" DOUBLE PRECISION,
    "externalUserId" TEXT NOT NULL,
    "profilePicUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Influencer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_username_key" ON "Influencer"("username");

-- CreateIndex
CREATE INDEX "Influencer_location_idx" ON "Influencer"("location");

-- CreateIndex
CREATE INDEX "Influencer_followerCount_idx" ON "Influencer"("followerCount");

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_platform_externalUserId_key" ON "Influencer"("platform", "externalUserId");
