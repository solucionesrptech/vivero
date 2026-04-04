-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('DELIVERY', 'PICKUP');

-- AlterEnum: nuevos valores (compatibles; no se eliminan PENDING/CONFIRMED/CANCELLED)
ALTER TYPE "OrderStatus" ADD VALUE 'AWAITING_PREPARATION';
ALTER TYPE "OrderStatus" ADD VALUE 'READY_FOR_DELIVERY';
ALTER TYPE "OrderStatus" ADD VALUE 'READY_FOR_PICKUP';
ALTER TYPE "OrderStatus" ADD VALUE 'PICKED_UP';
ALTER TYPE "OrderStatus" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveryType" "DeliveryType" NOT NULL DEFAULT 'PICKUP';
ALTER TABLE "Order" ADD COLUMN "customerName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "publicCode" TEXT;

UPDATE "Order" SET "publicCode" = 'P' || REPLACE("id"::text, '-', '') WHERE "publicCode" IS NULL;

CREATE UNIQUE INDEX "Order_publicCode_key" ON "Order"("publicCode");

ALTER TABLE "Order" ALTER COLUMN "publicCode" SET NOT NULL;

ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PREPARATION'::"OrderStatus";

CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
