# MusDist Architecture

## Goals

MusDist is designed as a production-grade music distribution platform. The first release will use distribution partners through provider adapters; direct DSP integrations can be added later without changing the core domain.

## Applications

- `apps/web` — artist/label portal
- `apps/admin` — operations, compliance, finance and support
- `apps/api` — NestJS HTTP API

## Packages

- `packages/database` — Drizzle schema and migrations
- `packages/music-domain` — artists, labels, releases, tracks, recordings and identifiers
- `packages/rights-domain` — works, writers, publishers, rights holders and splits
- `packages/royalty-domain` — royalty statements and allocation rules
- `packages/ledger` — double-entry financial ledger
- `packages/validation` — shared Zod validation
- `packages/ui` — shared UI components

## Workers

- media processing
- release validation
- distribution delivery
- DSP status synchronization
- royalty statement ingestion
- royalty calculation
- reconciliation
- payouts
- notifications

## Core flow

Artist -> Release -> Validation -> Distribution Order -> Provider Adapter -> DSP Network -> Royalty Report -> Royalty Engine -> Ledger -> Statement -> Payout

## Design principles

1. Money is represented by immutable ledger entries, never by editable balances.
2. Distribution providers are adapters behind a stable internal interface.
3. Release state transitions are explicit and auditable.
4. All financial and distribution operations are idempotent.
5. Audio and artwork binaries live in object storage; PostgreSQL stores metadata and references.
6. Every privileged mutation produces an audit event.
