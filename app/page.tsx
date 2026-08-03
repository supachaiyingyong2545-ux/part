'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { tracks, candidates } from '@/lib/data';
import { Candidate, VoteResults } from '@/lib/types';
import CandidateCard from '@/components/CandidateCard';
import TrackTabs from '@/components/TrackTabs';
import Toast from '@/components/Toast';

export default function VotingPage() {
  const [activeTrack, setActiveTrack] = useState(tracks[0].id);
  const [votedTracks, setVotedTracks] = useState<Record<string, string>>({});
  const [voteCounts, setVoteCounts] = useState<VoteResults>({});
  const [voterId, setVoterId] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setVoteCounts(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    let id = localStorage.getItem('dptc_voter_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('dptc_voter_id', id);
    }
    setVoterId(id);

    const voted = JSON.parse(localStorage.getItem('dptc_voted') || '{}');
    setVotedTracks(voted);

    fetchResults();
  }, [fetchResults]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVote = async (candidate: Candidate) => {
    if (!voterId || votedTracks[candidate.trackId] || loadingId) return;

    setLoadingId(candidate.id);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId,
          trackId: candidate.trackId,
          candidateId: candidate.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const newVoted = { ...votedTracks, [candidate.trackId]: candidate.id };
        setVotedTracks(newVoted);
        localStorage.setItem('dptc_voted', JSON.stringify(newVoted));

        setVoteCounts((prev) => ({
          ...prev,
          [candidate.trackId]: {
            ...(prev[candidate.trackId] || {}),
            [candidate.id]: (prev[candidate.trackId]?.[candidate.id] || 0) + 1,
          },
        }));

        showToast(`โหวตให้ "${candidate.pitchTitle}" สำเร็จแล้ว`, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const currentTrack = tracks.find((t) => t.id === activeTrack)!;
  const trackCandidates = candidates.filter((c) => c.trackId === activeTrack);
  const totalVoted = Object.keys(votedTracks).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg leading-none">⚡</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                DPTC Story Pitch Challenge
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 pl-7">
              โหวตให้ทีมที่คุณชื่นชอบ • 1 ท่าน 1 สิทธิ์ต่อสาย
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {totalVoted > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                โหวตแล้ว {totalVoted}/{tracks.length} สาย
              </span>
            )}
            <Link
              href="/results"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors whitespace-nowrap"
            >
              ดูผล →
            </Link>
          </div>
        </div>
      </header>

      {/* Track tabs */}
      <TrackTabs
        tracks={tracks}
        activeTrack={activeTrack}
        onSelect={setActiveTrack}
        votedTracks={votedTracks}
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentTrack.emoji} {currentTrack.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{currentTrack.description}</p>

          {votedTracks[activeTrack] ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              คุณโหวตในสายนี้แล้ว
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              เลือก 1 ทีมที่คุณชื่นชอบ
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trackCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              track={currentTrack}
              isVoted={votedTracks[candidate.trackId] === candidate.id}
              isOtherVoted={
                !!votedTracks[candidate.trackId] &&
                votedTracks[candidate.trackId] !== candidate.id
              }
              voteCount={voteCounts[candidate.trackId]?.[candidate.id] || 0}
              isLoading={loadingId === candidate.id}
              onVote={() => handleVote(candidate)}
            />
          ))}
        </div>

        {/* Progress footer */}
        {totalVoted < tracks.length && (
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 mb-3">
              ยังมีอีก {tracks.length - totalVoted} สายที่รอโหวตจากคุณ
            </p>
            <div className="flex justify-center gap-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track.id)}
                  className={`
                    w-8 h-1.5 rounded-full transition-all duration-200
                    ${votedTracks[track.id]
                      ? 'bg-green-400'
                      : track.id === activeTrack
                        ? 'bg-gray-900 w-12'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        )}

        {totalVoted === tracks.length && (
          <div className="mt-10 text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-semibold text-gray-900">คุณโหวตครบทุกสายแล้ว!</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">ขอบคุณที่ร่วมโหวตใน DPTC Story Pitch Challenge</p>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              ดูผลโหวตทั้งหมด →
            </Link>
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
