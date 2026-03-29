-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "slug" TEXT,
ADD COLUMN "categoryId" TEXT NOT NULL DEFAULT 'philodendros',
ADD COLUMN "shortDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "imageSrc" TEXT NOT NULL DEFAULT '',
ADD COLUMN "imageAlt" TEXT NOT NULL DEFAULT '',
ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

UPDATE "Product" SET "slug" = "id" WHERE "slug" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
