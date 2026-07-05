CREATE TABLE "telemetry_cache" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DROP INDEX "idx_leads_email";--> statement-breakpoint
DROP INDEX "idx_leads_created_at";--> statement-breakpoint
DROP INDEX "idx_leads_status";--> statement-breakpoint
DROP INDEX "idx_short_urls_hash";--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_email_unique" UNIQUE("email");