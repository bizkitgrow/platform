ALTER TABLE "leads" ADD COLUMN "status" varchar(50) DEFAULT 'new';--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_source" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_medium" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_campaign" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
CREATE INDEX "idx_leads_email" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");