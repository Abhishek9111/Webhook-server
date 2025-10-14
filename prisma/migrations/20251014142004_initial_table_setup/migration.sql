/*
  Warnings:

  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webHookData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webHookHash` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."webHookData" DROP CONSTRAINT "webHookData_webHookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."webHookHash" DROP CONSTRAINT "webHookHash_user_detail_id_fkey";

-- DropTable
DROP TABLE "public"."USER";

-- DropTable
DROP TABLE "public"."webHookData";

-- DropTable
DROP TABLE "public"."webHookHash";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhookhash" (
    "id" SERIAL NOT NULL,
    "urlString" TEXT NOT NULL,
    "user_detail_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhookhash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhookdata" (
    "id" SERIAL NOT NULL,
    "webHookId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhookdata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webhookhash" ADD CONSTRAINT "Webhookhash_user_detail_id_fkey" FOREIGN KEY ("user_detail_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhookdata" ADD CONSTRAINT "Webhookdata_webHookId_fkey" FOREIGN KEY ("webHookId") REFERENCES "Webhookhash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
