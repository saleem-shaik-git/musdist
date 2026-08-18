export type DistributionStatus =
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'live'
  | 'takedown_requested'
  | 'takedown_complete'
  | 'failed';

export interface DistributionReleasePayload {
  releaseId: string;
  upc?: string;
  title: string;
  releaseDate?: string;
  tracks: Array<{
    trackId: string;
    title: string;
    isrc?: string;
    audioStorageKey: string;
  }>;
  artworkStorageKey?: string;
}

export interface DistributionDeliveryResult {
  externalId?: string;
  status: DistributionStatus;
  response?: unknown;
}

export interface DistributionProvider {
  readonly key: string;
  submitRelease(payload: DistributionReleasePayload, idempotencyKey: string): Promise<DistributionDeliveryResult>;
  getReleaseStatus(externalId: string): Promise<DistributionStatus>;
  requestTakedown(externalId: string, reason: string): Promise<DistributionDeliveryResult>;
}
