'use client';

import { Track } from '@/lib/types';

const activeColors = {
  blue: 'bg-blue-600 text-white border-blue-600 shadow-blue-100',
  emerald: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-100',
  purple: 'bg-purple-600 text-white border-purple-600 shadow-purple-100',
  amber: 'bg-amber-500 text-white border-amber-500 shadow-amber-100',
};

interface Props {
  tracks: Track[];
  activeTrack: string;
  onSelect: (id: string) => void;
  votedTracks: Record<string, string>;
}

export default function TrackTabs({ tracks, activeTrack, onSelect, votedTracks }: Props) {
  return (
    <div className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-[73px] z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
          {tracks.map((track) => {
            const isActive = track.id === activeTrack;
            const isVoted = !!votedTracks[track.id];

            return (
              <button
                key={track.id}
                onClick={() => onSelect(track.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  whitespace-nowrap border transition-all duration-200 flex-shrink-0
                  ${isActive
                    ? `${activeColors[track.color]} shadow-sm`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-base leading-none">{track.emoji}</span>
                <span>{track.name}</span>
                {isVoted && (
                  <span className={`
                    text-xs font-bold leading-none
                    ${isActive ? 'opacity-80' : 'text-green-500'}
                  `}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
