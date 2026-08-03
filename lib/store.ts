import { candidates } from './data';

interface VoteStore {
  votes: Record<string, Record<string, number>>;
  voters: Record<string, Record<string, string>>;
}

const globalForStore = global as typeof globalThis & { voteStore: VoteStore };

if (!globalForStore.voteStore) {
  const initialVotes: Record<string, Record<string, number>> = {};
  for (const c of candidates) {
    if (!initialVotes[c.trackId]) initialVotes[c.trackId] = {};
    initialVotes[c.trackId][c.id] = 0;
  }
  globalForStore.voteStore = { votes: initialVotes, voters: {} };
}

const store = globalForStore.voteStore;

export function castVote(
  voterId: string,
  trackId: string,
  candidateId: string
): { success: boolean; message: string } {
  if (store.voters[voterId]?.[trackId]) {
    return { success: false, message: 'คุณได้โหวตในสายนี้แล้ว' };
  }

  if (!store.voters[voterId]) store.voters[voterId] = {};
  store.voters[voterId][trackId] = candidateId;

  if (!store.votes[trackId]) store.votes[trackId] = {};
  store.votes[trackId][candidateId] = (store.votes[trackId][candidateId] || 0) + 1;

  return { success: true, message: 'โหวตสำเร็จ' };
}

export function getVotes(): Record<string, Record<string, number>> {
  return JSON.parse(JSON.stringify(store.votes));
}
