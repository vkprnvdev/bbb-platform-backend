/*
  Warnings:

  - You are about to drop the column `method` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "method";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "tokens";

-- DropEnum
DROP TYPE "AuthMethod";

-- DropEnum
DROP TYPE "TokenType";

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
