-- AlterTable
ALTER TABLE "post" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredAt" TIMESTAMP(3),
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "post_featured_publishedAt_idx" ON "post"("featured", "publishedAt");

-- CreateIndex
CREATE INDEX "post_published_viewCount_idx" ON "post"("published", "viewCount");
