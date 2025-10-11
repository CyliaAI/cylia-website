-- CreateTable
CREATE TABLE "CustomCode" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "codeName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomCode_userId_codeName_key" ON "CustomCode"("userId", "codeName");

-- AddForeignKey
ALTER TABLE "CustomCode" ADD CONSTRAINT "CustomCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
