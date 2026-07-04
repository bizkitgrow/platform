import { bigint, boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// ============================================================
// Table: categories
// ============================================================
export const categories = pgTable('categories', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: rss_sources
// ============================================================
export const rssSources = pgTable('rss_sources', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  url: text('url').notNull().unique(),
  targetPillar: varchar('target_pillar', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  lastFetchedAt: timestamp('last_fetched_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: posts
// ============================================================
export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  rawMarkdown: text('raw_markdown'),
  polishedContent: text('polished_content'),
  hash: varchar('hash', { length: 64 }).notNull().unique(),
  metaDesc: varchar('meta_desc', { length: 255 }),
  categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id, {
    onDelete: 'set null',
  }),
  targetProductKey: varchar('target_product_key', { length: 255 }),
  sourceUrl: text('source_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: media_assets
// ============================================================
export const mediaAssets = pgTable('media_assets', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  postId: bigint('post_id', { mode: 'number' }).references(() => posts.id, { onDelete: 'cascade' }),
  promptString: text('prompt_string').notNull(),
  pollinationsUrl: text('pollinations_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: social_shares
// ============================================================
export const socialShares = pgTable('social_shares', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  postId: bigint('post_id', { mode: 'number' }).references(() => posts.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('PENDING'),
  platform: varchar('platform', { length: 50 }),
  syndicatedAt: timestamp('syndicated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: waiting_list
// ============================================================
export const waitingList = pgTable('waiting_list', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  businessName: varchar('business_name', { length: 255 }),
  targetedService: varchar('targeted_service', { length: 255 }).default('General'),
  couponSent: boolean('coupon_sent').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: automation_logs
// ============================================================
export const automationLogs = pgTable('automation_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  itemsFetched: integer('items_fetched').default(0),
  status: varchar('status', { length: 100 }).notNull(),
  executionDurationMs: bigint('execution_duration_ms', { mode: 'number' }).default(0),
  errorDetails: text('error_details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
