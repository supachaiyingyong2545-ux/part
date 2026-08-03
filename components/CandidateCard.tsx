'use client';

import { Candidate, Track } from '@/lib/types';

const colorMap = {
  blue: {
    avatar: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    voted: 'border-blue-300 bg-blue-50/30',
    votedBtn: 'bg-blue-50 text-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100',
    check: 'text-blue-500',
    dot: 'bg-blue-400',
  },
  emerald: {
    avatar: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    voted: 'border-emerald-300 bg-emerald-50/30',
    votedBtn: 'bg-emerald-50 text-emerald-600',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100',
    check: 'text-emerald-500',
    dot: 'bg-emerald-400',
  },
  purple: {
    avatar: 'bg-purple-600',
    badge: 'bg-purple-50 text-purple-700 border-purple-100',
    voted: 'border-purple-300 bg-purple-50/30',
    votedBtn: 'bg-purple-50 text-purple-600',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100',
    check: 'text-purple-500',
    dot: 'bg-purple-400',
  },
  amber: {
    avatar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    voted: 'border-amber-300 bg-amber-50/30',
    votedBtn: 'bg-amber-50 text-amber-600',
    btn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100',
    check: 'text-amber-500',
    dot: 'bg-amber-400',
  },
};

interface Props {
  candidate: Candidate;
  track: Track;
  isVoted: boolean;
  isOtherVoted: boolean;
  voteCount: number;
  isLoading: boolean;
  onVote: () => void;
}

export default function CandidateCard({
  candidate,
  track,
  isVoted,
  isOtherVoted,
  voteCount,
  isLoading,
  onVote,
}: Props) {
  const c = colorMap[track.color];
  const letter = candidate.teamName.charAt(0).toUpperCase();
  const disabled = isVoted || isOtherVoted || isLoading;

  return (
    <div
      className={`
        relative bg-white rounded-2xl p-6 border transition-all duration-200 animate-fade-in
        ${isVoted
          ? `border-2 ${c.voted} shadow-sm`
          : 'border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }
        ${isOtherVoted ? 'opacity-50' : ''}
      `}
    >
      {isVoted && (
        <div className="absolute top-4 right-4">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${c.check}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.avatar} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
          {letter}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-none mb-1">
            {candidate.teamName}
          </p>
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {candidate.pitchTitle}
          </h3>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        {candidate.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {candidate.members.map((member) => (
          <span
            key={member}
            className={`text-xs px-2.5 py-1 rounded-full border ${c.badge}`}
          >
            {member}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isVoted ? c.dot : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-400">
            {voteCount} {voteCount === 1 ? 'โหวต' : 'โหวต'}
          </span>
        </div>

        <button
          onClick={onVote}
          disabled={disabled}
          className={`
            px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150
            ${isVoted
              ? `${c.votedBtn} cursor-default`
              : isOtherVoted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-wait'
                  : `${c.btn} shadow-sm hover:shadow-md active:scale-95`
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              กำลังโหวต
            </span>
          ) : isVoted ? (
            'โหวตแล้ว ✓'
          ) : (
            'โหวต'
          )}
        </button>
      </div>
    </div>
  );
}
