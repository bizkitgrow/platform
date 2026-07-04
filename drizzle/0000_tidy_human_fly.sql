CREATE TABLE "categories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "inbound_webhooks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"event_id" varchar(255) NOT NULL,
	"provider" varchar(100) DEFAULT 'ResellPortal' NOT NULL,
	"payload_type" varchar(100) NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "inbound_webhooks_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"ai_summary" jsonb NOT NULL,
	"original_image" text,
	"hash" varchar(64) NOT NULL,
	"meta_desc" varchar(160) NOT NULL,
	"category_id" bigint,
	"source_url" text,
	"target_product_sku" varchar(50) DEFAULT 'general',
	"resellportal_order_id" text,
	"resellportal_status" varchar(20) DEFAULT 'pending',
	"webhook_processed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug"),
	CONSTRAINT "posts_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_posts_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_posts_hash" ON "posts" USING btree ("hash");