/*
  Warnings:

  - You are about to drop the column `password` on the `customers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."customers_password_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "password";
