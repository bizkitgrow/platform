# Database Schema & Data Model

> **File:** `docs/03_DATABASE_SCHEMA.md`  
> Refs: [Drizzle ORM Docs](https://orm.drizzle.team) · [Supabase PostgreSQL Docs](https://supabase.com/docs/guides/database) · [PostgreSQL 16 Docs](https://www.postgresql.org/docs/16/)

---

## 1. Overview ERD (Entity Relationship)

```
categories (1) ──────< posts (N)
    │                     │
    │ slug                 │ target_product_key
    │                     │
    ▼                     ▼
[connectivity-mobility]   [20 product keys]
[local-authority]
[operational-automation]

waiting_list  (standalone — lead capture)
automation_logs (standalone — health monitoring)
```

**Relasi:**
- `posts.category_id` → `categories.id` (ON DELETE SET NULL)
- `posts.target_product_key` → key dalam `system_architecture.json` (soft reference)

---

## 2. SQL DDL — PostgreSQL (Supabase Compatible)

```sql
-- ============================================================
-- TABLE 1: categories — Content Silo Classification
-- ============================================================
CREATE TABLE categories (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- TABLE 2: posts — AGC Content Model
-- ============================================================
CREATE TABLE posts (
  id                 BIGSERIAL PRIMARY KEY,
  title              VARCHAR(255) NOT NULL,
  slug               VARCHAR(255) UNIQUE NOT NULL,
  content            TEXT NOT NULL,
  meta_desc          VARCHAR(255),
  category_id        BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  target_product_key VARCHAR(255),
  source_url         TEXT,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- TABLE 3: waiting_list — Lead Conversion Engine
-- ============================================================
CREATE TABLE waiting_list (
  id               BIGSERIAL PRIMARY KEY,
  email            VARCHAR(255) UNIQUE NOT NULL,
  business_name    VARCHAR(255),
  targeted_service VARCHAR(255) DEFAULT 'General',
  coupon_sent      BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- TABLE 4: automation_logs — Health & Anti-Pause Shield
-- ============================================================
CREATE TABLE automation_logs (
  id                   BIGSERIAL PRIMARY KEY,
  items_fetched        INTEGER DEFAULT 0,
  status               VARCHAR(100) NOT NULL,
  execution_duration_ms BIGINT DEFAULT 0,
  error_details        TEXT,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- INDEXES — Optimized for high-concurrency Astro ISR routing
-- ============================================================
CREATE INDEX IF NOT EXISTS posts_category_id_idx ON posts(category_id);

-- ============================================================
-- SEED DATA — Base content pillars
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Connectivity & Mobility',  'connectivity-mobility'),
  ('Local Business Authority', 'local-authority'),
  ('Operational Automation',   'operational-automation')
ON CONFLICT (slug) DO NOTHING;
```

---

## 3. Drizzle ORM Schema (TypeScript)

File ini disimpan di: `src/db/schema.ts`

```typescript
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  bigint,
  integer,
} from 'drizzle-orm/pg-core';

// ============================================================
// Table: categories
// ============================================================
export const categories = pgTable('categories', {
  id:   bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: posts
// ============================================================
export const posts = pgTable('posts', {
  id:               bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title:            varchar('title', { length: 255 }).notNull(),
  slug:             varchar('slug', { length: 255 }).notNull().unique(),
  content:          text('content').notNull(),
  metaDesc:         varchar('meta_desc', { length: 255 }),
  categoryId:       bigint('category_id', { mode: 'number' }).references(() => categories.id, { onDelete: 'set null' }),
  targetProductKey: varchar('target_product_key', { length: 255 }),
  sourceUrl:        text('source_url'),
  createdAt:        timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: waiting_list
// ============================================================
export const waitingList = pgTable('waiting_list', {
  id:              bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email:           varchar('email', { length: 255 }).notNull().unique(),
  businessName:    varchar('business_name', { length: 255 }),
  targetedService: varchar('targeted_service', { length: 255 }).default('General'),
  couponSent:      boolean('coupon_sent').default(false),
  createdAt:       timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Table: automation_logs
// ============================================================
export const automationLogs = pgTable('automation_logs', {
  id:                  bigint('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  itemsFetched:        integer('items_fetched').default(0),
  status:              varchar('status', { length: 100 }).notNull(),
  executionDurationMs: bigint('execution_duration_ms', { mode: 'number' }).default(0),
  errorDetails:        text('error_details'),
  createdAt:           timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Type Exports (for type-safe queries)
// ============================================================
export type Category       = typeof categories.$inferSelect;
export type NewCategory    = typeof categories.$inferInsert;
export type Post           = typeof posts.$inferSelect;
export type NewPost        = typeof posts.$inferInsert;
export type WaitingListRow = typeof waitingList.$inferSelect;
export type AutomationLog  = typeof automationLogs.$inferSelect;
```

---

## 4. Field Reference

### `posts.target_product_key` — Valid Values

| Key | Pilar | Route |
|---|---|---|
| `esim_data_plans` | 1 | `/esim/[country]` |
| `vpn_service` | 1 | `/esim/[country]` |
| `business_phone_number` | 1 | `/esim/[country]` |
| `cloud_storage` | 1 | `/esim/[country]` |
| `reputation_management` | 2 | `/reputation/[city]` |
| `ai_website_builder` | 2 | `/reputation/[city]` |
| `domain_registration` | 2 | `/reputation/[city]` |
| `web_hosting` | 2 | `/reputation/[city]` |
| `web_design_service` | 2 | `/reputation/[city]` |
| `monthly_seo_service` | 2 | `/reputation/[city]` |
| `smm_services` | 2 | `/reputation/[city]` |
| `social_media_automation` | 2 | `/reputation/[city]` |
| `link_in_bio` | 2 | `/reputation/[city]` |
| `ai_business_tools_suite` | 3 | `/solutions/[service_slug]` |
| `invoicing_with_ai` | 3 | `/solutions/[service_slug]` |
| `appointment_booking` | 3 | `/solutions/[service_slug]` |
| `document_signing_software` | 3 | `/solutions/[service_slug]` |
| `crm_system` | 3 | `/solutions/[service_slug]` |
| `wordpress_plugin_installer_pack` | 3 | `/solutions/[service_slug]` |
| `email_marketing` | 3 | `/solutions/[service_slug]` |

### `automation_logs.status` — Valid Values

| Value | Deskripsi |
|---|---|
| `SUCCESS` | Pipeline berjalan normal, ada item yang diproses |
| `ERROR` | Pipeline gagal, lihat `error_details` |
| `HEARTBEAT_Preservation_Active` | Tidak ada konten baru, tulis sebagai anti-pause ping |

---

## 5. Database Setup di Supabase

```bash
# 1. Buka Supabase Dashboard → SQL Editor
# 2. Paste seluruh isi SQL DDL dari Section 2
# 3. Klik Run

# Verifikasi:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
# Expected: automation_logs, categories, posts, waiting_list
```

---

## 6. Drizzle Migration Commands

```bash
# Generate migration dari schema changes
npx drizzle-kit generate

# Push schema langsung ke DB (development)
npx drizzle-kit push

# Buka Drizzle Studio (visual DB browser)
npx drizzle-kit studio
```

**Referensi:** [orm.drizzle.team/docs/migrations](https://orm.drizzle.team/docs/migrations)
