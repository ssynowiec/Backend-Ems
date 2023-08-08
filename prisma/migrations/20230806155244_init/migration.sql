-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'CREATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "facebook_link" TEXT,
    "facebook_event_id" TEXT,
    "instagram_link" TEXT,
    "linkedin_link" TEXT,
    "linkedin_event_link" TEXT,
    "twitter_link" TEXT,
    "youtube_link" TEXT,
    "tiktok_link" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_code_key" ON "Event"("code");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
