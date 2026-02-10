/*
  Warnings:

  - You are about to drop the `Paitent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paitent" DROP CONSTRAINT "Paitent_userId_fkey";

-- DropTable
DROP TABLE "Paitent";

-- CreateTable
CREATE TABLE "paitent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "paitent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paitent_email_key" ON "paitent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "paitent_userId_key" ON "paitent"("userId");

-- CreateIndex
CREATE INDEX "idx_paitent_email" ON "paitent"("email");

-- CreateIndex
CREATE INDEX "idx_paitent_isDeleted" ON "paitent"("isDeleted");

-- AddForeignKey
ALTER TABLE "paitent" ADD CONSTRAINT "paitent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
