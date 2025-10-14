-- CreateTable
CREATE TABLE "public"."USER" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webHookHash" (
    "id" SERIAL NOT NULL,
    "urlString" TEXT NOT NULL,
    "user_detail_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webHookHash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webHookData" (
    "id" SERIAL NOT NULL,
    "webHookId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webHookData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."webHookHash" ADD CONSTRAINT "webHookHash_user_detail_id_fkey" FOREIGN KEY ("user_detail_id") REFERENCES "public"."USER"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webHookData" ADD CONSTRAINT "webHookData_webHookId_fkey" FOREIGN KEY ("webHookId") REFERENCES "public"."webHookHash"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
