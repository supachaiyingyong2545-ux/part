'use client';

interface Props {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: Props) {
  return (
    <div
      className={`
        fixed bottom-8 left-1/2 z-50 animate-slide-up
        flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl
        text-sm font-medium whitespace-nowrap
        ${type === 'success'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-red-600 border border-red-100 shadow-red-50'
        }
      `}
      style={{ transform: 'translateX(-50%)' }}
    >
      <span className="text-base leading-none">
        {type === 'success' ? '🎉' : '⚠️'}
      </span>
      {message}
    </div>
  );
}
