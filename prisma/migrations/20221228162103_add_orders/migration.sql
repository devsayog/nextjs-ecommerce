/*
  Warnings:

  - Added the required column `customerId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentIntent` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "paymentIntent" TEXT NOT NULL;
