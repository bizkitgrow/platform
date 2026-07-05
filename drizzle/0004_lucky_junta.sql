CREATE TABLE "short_urls" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"hash" varchar(64) NOT NULL,
	"original_url" text NOT NULL,
	"clicks" bigint DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "short_urls_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_short_urls_hash" ON "short_urls" USING btree ("hash");