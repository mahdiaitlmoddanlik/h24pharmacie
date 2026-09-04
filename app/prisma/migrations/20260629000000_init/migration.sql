-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('website', 'manual', 'official', 'user', 'pharmacy');

-- CreateEnum
CREATE TYPE "duty_period" AS ENUM ('day', 'night', '24h', 'unknown');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('unverified', 'source_verified', 'user_confirmed', 'pharmacy_claimed');

-- CreateEnum
CREATE TYPE "scrape_status" AS ENUM ('success', 'partial', 'failed');

-- CreateEnum
CREATE TYPE "report_issue_type" AS ENUM ('closed', 'wrong_phone', 'wrong_address', 'not_on_duty', 'other');

-- CreateEnum
CREATE TYPE "report_status" AS ENUM ('new', 'reviewed', 'resolved', 'rejected');

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "type" "source_type" NOT NULL DEFAULT 'website',
    "last_checked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT,
    "region_ar" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "address" TEXT,
    "address_ar" TEXT,
    "neighborhood" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "google_maps_url" TEXT,
    "waze_url" TEXT,
    "source_id" TEXT,
    "source_external_id" TEXT,
    "verification_status" "verification_status" NOT NULL DEFAULT 'unverified',
    "claimed_by_pharmacy" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duty_schedules" (
    "id" TEXT NOT NULL,
    "pharmacy_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "duty_date" DATE NOT NULL,
    "period" "duty_period" NOT NULL DEFAULT 'unknown',
    "source_id" TEXT,
    "source_url" TEXT,
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidence_score" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duty_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrape_runs" (
    "id" TEXT NOT NULL,
    "source_id" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "status" "scrape_status" NOT NULL DEFAULT 'success',
    "cities_updated" INTEGER NOT NULL DEFAULT 0,
    "records_found" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "raw_snapshot_path" TEXT,

    CONSTRAINT "scrape_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "pharmacy_id" TEXT,
    "city_id" TEXT,
    "issue_type" "report_issue_type" NOT NULL,
    "message" TEXT,
    "user_ip_hash" TEXT,
    "status" "report_status" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE INDEX "pharmacies_city_id_idx" ON "pharmacies"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_city_id_slug_key" ON "pharmacies"("city_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_source_id_source_external_id_key" ON "pharmacies"("source_id", "source_external_id");

-- CreateIndex
CREATE INDEX "duty_schedules_city_id_duty_date_idx" ON "duty_schedules"("city_id", "duty_date");

-- CreateIndex
CREATE INDEX "duty_schedules_duty_date_idx" ON "duty_schedules"("duty_date");

-- CreateIndex
CREATE UNIQUE INDEX "duty_schedules_pharmacy_id_duty_date_period_key" ON "duty_schedules"("pharmacy_id", "duty_date", "period");

-- CreateIndex
CREATE INDEX "scrape_runs_started_at_idx" ON "scrape_runs"("started_at");

-- CreateIndex
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");

-- AddForeignKey
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_schedules" ADD CONSTRAINT "duty_schedules_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_schedules" ADD CONSTRAINT "duty_schedules_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duty_schedules" ADD CONSTRAINT "duty_schedules_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scrape_runs" ADD CONSTRAINT "scrape_runs_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Supabase hardening: the app reads/writes through Prisma server-side, not the
-- public Data API, so public API roles should not receive table access by default.
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duty_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE
      public.sources,
      public.cities,
      public.pharmacies,
      public.duty_schedules,
      public.scrape_runs,
      public.reports
    FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE
      public.sources,
      public.cities,
      public.pharmacies,
      public.duty_schedules,
      public.scrape_runs,
      public.reports
    FROM authenticated;
  END IF;
END $$;
