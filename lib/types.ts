export interface Candidate {
  id: string;
  teamName: string;
  pitchTitle: string;
  description: string;
  trackId: string;
  members: string[];
}

export interface Track {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  emoji: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
}

export interface VotePayload {
  voterId: string;
  trackId: string;
  candidateId: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
}

export type VoteResults = Record<string, Record<string, number>>;
