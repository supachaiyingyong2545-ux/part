'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tracks, candidates } from '@/lib/data';
import { VoteResults } from '@/lib/types';

const barColors = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
};

const textColors = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600',
};

const bgColors = {
  blue: 'bg-blue-50',
  emerald: 'bg-emerald-50',
  purple: 'bg-purple-50',
  amber: 'bg-amber-50',
};

const badgeColors = {
  blue: 'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  purple: 'bg-purple-600 text-white',
  amber: 'bg-amber-500 text-white',
};

export default function ResultsPage() {
  const [voteCounts, setVoteCounts] = useState<VoteResults>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setVoteCounts(data);
      setLastUpdated(new Date());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalAllVotes = tracks.reduce((sum, track) => {
    const trackVotes = candidates
      .filter((c) => c.trackId === track.id)
      .reduce((s, c) => s + (voteCounts[track.id]?.[c.id] || 0), 0);
    return sum + trackVotes;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">ผลการโหวต</h1>
            <p className="text-xs sm:text-sm text-gray-400">DPTC Story Pitch Challenge</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="hidden sm:block text-xs text-gray-400">
                อัปเดต {lastUpdated.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchResults}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
              title="รีเฟรชผล"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors whitespace-nowrap"
            >
              ← โหวต
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {tracks.map((track) => {
            const trackTotal = candidates
              .filter((c) => c.trackId === track.id)
              .reduce((s, c) => s + (voteCounts[track.id]?.[c.id] || 0), 0);

            return (
              <div key={track.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="text-xl mb-1">{track.emoji}</div>
                <div className={`text-2xl font-bold ${textColors[track.color]}`}>{trackTotal}</div>
                <div className="text-xs text-gray-400 mt-0.5">{track.name}</div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">คะแนนทั้งหมด</h2>
          <span className="text-2xl font-bold text-gray-900">{totalAllVotes}</span>
        </div>

        {/* Track results */}
        <div className="space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            tracks.map((track) => {
              const trackCandidates = candidates
                .filter((c) => c.trackId === track.id)
                .map((c) => ({
                  ...c,
                  votes: voteCounts[track.id]?.[c.id] || 0,
                }))
                .sort((a, b) => b.votes - a.votes);

              const totalVotes = trackCandidates.reduce((s, c) => s + c.votes, 0);
              const maxVotes = Math.max(...trackCandidates.map((c) => c.votes), 1);

              return (
                <div key={track.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`px-5 py-4 border-b border-gray-50 ${bgColors[track.color]}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        {track.emoji} {track.name}
                      </h3>
                      <span className="text-sm text-gray-400">{totalVotes} โหวต</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {trackCandidates.map((candidate, index) => {
                      const percentage =
                        totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                      const barWidth =
                        candidate.votes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
                      const isFirst = index === 0 && candidate.votes > 0;

                      return (
                        <div key={candidate.id} className="px-5 py-4">
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-6 flex-shrink-0 text-center">
                              {isFirst ? (
                                <span className="text-base">🏆</span>
                              ) : (
                                <span className="text-sm font-semibold text-gray-300">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm leading-tight">
                                {candidate.pitchTitle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{candidate.teamName}</p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className={`flex items-center gap-1.5 justify-end`}>
                                {isFirst && candidate.votes > 0 && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[track.color]}`}>
                                    อันดับ 1
                                  </span>
                                )}
                                <p className={`text-lg font-bold ${isFirst ? textColors[track.color] : 'text-gray-700'}`}>
                                  {candidate.votes}
                                </p>
                              </div>
                              <p className="text-xs text-gray-400">
                                {percentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          <div className="ml-9 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`${barColors[track.color]} h-full rounded-full transition-all duration-700`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          ผลโหวตอัปเดตทุก 10 วินาที
        </p>
      </main>
    </div>
  );
}
