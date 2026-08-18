import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
};

export const organizationType = pgEnum('organization_type', ['artist', 'label']);
export const releaseType = pgEnum('release_type', ['single', 'ep', 'album', 'compilation']);
export const releaseStatus = pgEnum('release_status', [
  'draft', 'validating', 'ready_for_review', 'approved', 'rejected',
  'distributing', 'delivered', 'live', 'validation_failed', 'dsp_failed', 'takedown',
]);
export const assetType = pgEnum('asset_type', ['audio_master', 'artwork']);
export const contributorRole = pgEnum('contributor_role', ['primary_artist', 'featured_artist', 'producer', 'composer', 'lyricist', 'remixer', 'other']);
export const rightType = pgEnum('right_type', ['master', 'mechanical', 'performance', 'sync', 'publishing']);
export const ledgerAccountType = pgEnum('ledger_account_type', ['platform_revenue', 'artist_payable', 'label_payable', 'producer_payable', 'tax_payable', 'dsp_receivable', 'payout_clearing']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  ...timestamps,
});

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: organizationType('type').notNull(),
  ...timestamps,
});

export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: text('role').notNull(),
  ...timestamps,
});

export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  stageName: text('stage_name').notNull(),
  legalName: text('legal_name'),
  bio: text('bio'),
  country: text('country'),
  ...timestamps,
});

export const labels = pgTable('labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  name: text('name').notNull(),
  ...timestamps,
});

export const releases = pgTable('releases', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  labelId: uuid('label_id').references(() => labels.id),
  title: text('title').notNull(),
  version: text('version'),
  type: releaseType('type').notNull(),
  upc: text('upc').unique(),
  catalogNumber: text('catalog_number'),
  genre: text('genre'),
  language: text('language'),
  releaseDate: timestamp('release_date', { withTimezone: true }),
  copyrightYear: integer('copyright_year'),
  copyrightOwner: text('copyright_owner'),
  status: releaseStatus('status').default('draft').notNull(),
  ...timestamps,
});

export const tracks = pgTable('tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  releaseId: uuid('release_id').notNull().references(() => releases.id),
  title: text('title').notNull(),
  version: text('version'),
  isrc: text('isrc').unique(),
  explicit: boolean('explicit').default(false).notNull(),
  lyrics: text('lyrics'),
  position: integer('position').notNull(),
  ...timestamps,
});

export const recordings = pgTable('recordings', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').notNull().references(() => tracks.id),
  title: text('title').notNull(),
  durationMs: integer('duration_ms'),
  sampleRate: integer('sample_rate'),
  channels: integer('channels'),
  bitDepth: integer('bit_depth'),
  ...timestamps,
});

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: assetType('type').notNull(),
  storageKey: text('storage_key').notNull().unique(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: numeric('size_bytes', { precision: 20, scale: 0 }),
  checksum: text('checksum'),
  metadata: jsonb('metadata'),
  ...timestamps,
});

export const trackAssets = pgTable('track_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').notNull().references(() => tracks.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  ...timestamps,
});

export const releaseAssets = pgTable('release_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  releaseId: uuid('release_id').notNull().references(() => releases.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  ...timestamps,
});

export const works = pgTable('works', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  iswc: text('iswc').unique(),
  ...timestamps,
});

export const trackWorks = pgTable('track_works', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').notNull().references(() => tracks.id),
  workId: uuid('work_id').notNull().references(() => works.id),
  ...timestamps,
});

export const contributors = pgTable('contributors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  ipi: text('ipi'),
  ...timestamps,
});

export const trackContributors = pgTable('track_contributors', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').notNull().references(() => tracks.id),
  contributorId: uuid('contributor_id').notNull().references(() => contributors.id),
  role: contributorRole('role').notNull(),
  ...timestamps,
});

export const rightsHolders = pgTable('rights_holders', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  ...timestamps,
});

export const royaltySplits = pgTable('royalty_splits', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').notNull().references(() => tracks.id),
  rightsHolderId: uuid('rights_holder_id').notNull().references(() => rightsHolders.id),
  rightType: rightType('right_type').notNull(),
  sharePercent: numeric('share_percent', { precision: 7, scale: 4 }).notNull(),
  ...timestamps,
});

export const distributionProviders = pgTable('distribution_providers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  adapterKey: text('adapter_key').notNull().unique(),
  enabled: boolean('enabled').default(true).notNull(),
  ...timestamps,
});

export const distributionReleases = pgTable('distribution_releases', {
  id: uuid('id').defaultRandom().primaryKey(),
  releaseId: uuid('release_id').notNull().references(() => releases.id),
  providerId: uuid('provider_id').notNull().references(() => distributionProviders.id),
  externalId: text('external_id'),
  status: text('status').notNull(),
  lastError: text('last_error'),
  ...timestamps,
});

export const distributionDeliveries = pgTable('distribution_deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributionReleaseId: uuid('distribution_release_id').notNull().references(() => distributionReleases.id),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  status: text('status').notNull(),
  attemptCount: integer('attempt_count').default(0).notNull(),
  payload: jsonb('payload'),
  response: jsonb('response'),
  ...timestamps,
});

export const ledgerAccounts = pgTable('ledger_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  type: ledgerAccountType('type').notNull(),
  currency: text('currency').notNull(),
  ...timestamps,
});

export const ledgerEntries = pgTable('ledger_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionId: uuid('transaction_id').notNull(),
  accountId: uuid('account_id').notNull().references(() => ledgerAccounts.id),
  debit: numeric('debit', { precision: 20, scale: 4 }).default('0').notNull(),
  credit: numeric('credit', { precision: 20, scale: 4 }).default('0').notNull(),
  currency: text('currency').notNull(),
  referenceType: text('reference_type'),
  referenceId: uuid('reference_id'),
  ...timestamps,
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata'),
  ...timestamps,
});
