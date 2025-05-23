/*
  Warnings:

  - You are about to drop the column `status` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "status",
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;
