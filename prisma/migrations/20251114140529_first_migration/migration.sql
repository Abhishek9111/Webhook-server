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
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apiCallUrl" TEXT NOT NULL,
    "typeOfCall" TEXT NOT NULL,
    "tempField" TEXT,

    CONSTRAINT "Webhookdata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webhookhash_urlString_key" ON "Webhookhash"("urlString");

-- AddForeignKey
ALTER TABLE "Webhookhash" ADD CONSTRAINT "Webhookhash_user_detail_id_fkey" FOREIGN KEY ("user_detail_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhookdata" ADD CONSTRAINT "Webhookdata_webHookId_fkey" FOREIGN KEY ("webHookId") REFERENCES "Webhookhash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
