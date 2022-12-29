/*
  Warnings:

  - Added the required column `shippingCharge` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SHIPPING', 'SUCCESS', 'CANCELED');

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shippingCharge" INTEGER NOT NULL;
