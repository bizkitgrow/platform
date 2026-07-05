import {
  bigint,
  bigserial,
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const posts = pgTable(
  'posts',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text('content').notNull(),

    aiSummary: jsonb('ai_summary')
      .$type<{
        hook: string;
        tags: string[];
        metaDesc: string;
        socialWidget: string;
        paraphrasedHook?: string;
        syntacticVariant?: string;
        paraphraseSummary?: string;
        originalTokenCount?: number;
        newTokenCount?: number;
      }>()
      .notNull(),

    originalImage: text('original_image'),
    hash: varchar('hash', { length: 64 }).notNull().unique(),
    metaDesc: varchar('meta_desc', { length: 160 }).notNull(),
    categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id, {
      onDelete: 'set null',
    }),
    sourceUrl: text('source_url'),

    targetProductSku: varchar('target_product_sku', { length: 50 }).default('general'),
    resellportalOrderId: text('resellportal_order_id'),
    resellportalStatus: varchar('resellportal_status', { length: 20 }).default('pending'),
    webhookProcessed: boolean('webhook_processed').default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('idx_posts_slug').on(table.slug),
    hashIdx: uniqueIndex('idx_posts_hash').on(table.hash),
  }),
);

export const inboundWebhooks = pgTable('inbound_webhooks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  eventId: varchar('event_id', { length: 255 }).notNull().unique(),
  eventSignature: varchar('event_signature', { length: 255 }).notNull().unique(),
  provider: varchar('provider', { length: 100 }).notNull().default('ResellPortal'),
  payloadType: varchar('payload_type', { length: 100 }).notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).defaultNow(),
});

export const leads = pgTable('leads', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  businessName: varchar('business_name', { length: 255 }),
  targetedService: varchar('targeted_service', { length: 100 }),
  status: varchar('status', { length: 50 }).default('new'),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const shortUrls = pgTable('short_urls', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  hash: varchar('hash', { length: 64 }).notNull().unique(),
  originalUrl: text('original_url').notNull(),
  clicks: bigint('clicks', { mode: 'number' }).default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const telemetryCache = pgTable('telemetry_cache', {
  id: varchar('id', { length: 50 }).primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
