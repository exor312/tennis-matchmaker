'use client';

import { useState, useEffect } from 'react';

interface Standing {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/standings');
      if (res.ok) {
        const data = await res.json();
        setStandings(data);
      }
    } catch (err) {
      console.error('Failed to fetch standings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const playerName = typeof window !== 'undefined' ? localStorage.getItem('playerName') : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-24 pt-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-xl tracking-widest text-white">STANDINGS</h1>
        <button
          type="button"
          onClick={fetchStandings}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          aria-label="Refresh standings"
        >
          <svg
            className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#22c55e] animate-spin" />
        </div>
      ) : standings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-white/30 text-sm">Play your first match to appear on the leaderboard</p>
        </div>
      ) : (
        /* Leaderboard Table */
        <div className="w-full">
          {/* Header Row */}
          <div className="grid grid-cols-[2rem_1fr_3rem_3rem_4rem] gap-4 py-2 border-b border-white/[0.06]">
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-semibold">
              #
            </span>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-semibold">
              PLAYER
            </span>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-semibold text-right">
              W
            </span>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-semibold text-right">
              L
            </span>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40 font-semibold text-right">
              WIN%
            </span>
          </div>

          {/* Data Rows */}
          {standings.map((player) => {
            const isCurrentPlayer = playerName && player.name === playerName;
            return (
              <div
                key={player.rank}
                className={`grid grid-cols-[2rem_1fr_3rem_3rem_4rem] gap-4 py-3 border-b border-white/[0.04] items-center ${
                  isCurrentPlayer
                    ? 'border-l-2 border-l-[#22c55e] bg-[#22c55e]/5 -ml-4 pl-4 pr-4'
                    : ''
                }`}
              >
                <span className="font-black text-lg tabular-nums text-white">
                  {player.rank}
                </span>
                <span className="font-semibold text-sm text-white truncate overflow-ellipsis">
                  {player.name}
                </span>
                <span className="font-bold text-sm tabular-nums text-[#22c55e] text-right">
                  {player.wins}
                </span>
                <span className="text-sm tabular-nums text-white/50 text-right">
                  {player.losses}
                </span>
                <span className="font-bold text-sm tabular-nums text-white text-right">
                  {player.winPercentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
