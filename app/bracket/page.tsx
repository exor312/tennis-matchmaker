'use client';

import { useState, useEffect } from 'react';
import MatchCard from '@/components/shared/MatchCard';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface MatchPlayer {
  name: string;
}

interface MatchScore {
  set: number;
  p1_games: number;
  p2_games: number;
  p1_tiebreak?: number;
  p2_tiebreak?: number;
}

interface Match {
  id: string;
  player1: MatchPlayer | null;
  player2: MatchPlayer | null;
  player3?: MatchPlayer | null;
  player4?: MatchPlayer | null;
  status: 'pending' | 'in_progress' | 'completed';
  format: 'singles' | 'doubles' | 'mix';
  scores?: MatchScore[];
}

interface BracketData {
  matches: Match[];
  players: string[];
  format?: string;
}

function getVariant(status: Match['status']) {
  switch (status) {
    case 'in_progress':
      return 'active';
    case 'completed':
      return 'completed';
    case 'pending':
    default:
      return 'pending';
  }
}

export default function BracketPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [format, setFormat] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/bracket');
      if (res.ok) {
        const data: BracketData = await res.json();
        setMatches(data.matches || []);
        setPlayers(data.players || []);
        setFormat(data.format || '');
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-black text-xl tracking-widest">BRACKET</h1>
          <button
            onClick={onRefresh}
            className="text-white/40 hover:text-white/80 transition-colors p-2"
            aria-label="Refresh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
        </div>

        {/* Session Info Badge */}
        {format && (
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/60 font-medium uppercase tracking-wide">
              <span className="capitalize">{format}</span>
              <span className="text-white/20">·</span>
              <span>{players.length} player{players.length !== 1 ? 's' : ''}</span>
            </span>
          </div>
        )}

        {/* Queue Section */}
        {players.length > 0 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
              Queue
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {players.map((name, i) => (
                <span
                  key={i}
                  className="shrink-0 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Matches Section */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
            Matches
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot mb-3" />
              <p className="text-white/30 text-sm">Loading bracket...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot mb-3" />
              <p className="text-white font-medium mb-1">Waiting for matches...</p>
              <p className="text-white/30 text-sm">
                Players will be paired automatically
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  variant={getVariant(match.status)}
                >
                  <StatusBadge status={match.status === 'in_progress' ? 'live' : match.status === 'completed' ? 'completed' : 'pending'} />
                </MatchCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
