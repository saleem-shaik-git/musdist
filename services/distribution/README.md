# Distribution Service

The distribution service is intentionally provider-agnostic.

## Contract

Each provider adapter must implement:

- `submitRelease`
- `getReleaseStatus`
- `requestTakedown`

Provider-specific credentials, payload formats and external IDs must never leak into the core music domain.

## Initial production strategy

MusDist will integrate an approved distribution partner first. Direct DSP delivery adapters will be added only after the required commercial/API relationships are in place.
