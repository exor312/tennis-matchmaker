'use client';

import { useState, useEffect } from 'react';
import MatchCard from '@/components/shared/MatchCard';
import { ActionButton } from '@/components/shared/ActionButton';

const PRESET_SCORES = ['6-0', '6-1', '6-2', '6-3', '6-4', '7-5', '7-6'];

function getVariant(status: string): 'active' | 'completed' | 'pending' {
  if (status === 'in_progress') return 'active';
  if (status === 'completed') return 'completed';
  return 'pending';
}

export default function ScorePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const [customP1, setCustomP1] = useState(0);
  const [customP2, setCustomP2] = useState(0);
  const [customTiebreak, setCustomTiebreak] = useState('');
  const [flash, setFlash] = useState(false);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/score');
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleToggle = (matchId: string) => {
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
      setShowCustom(false);
    } else {
      setExpandedMatchId(matchId);
      setShowCustom(false);
      setCustomP1(0);
      setCustomP2(0);
      setCustomTiebreak('');
    }
  };

  const handlePresetScore = async (score: string) => {
    const [p1, p2] = score.split('-').map(Number);
    await submitScore(p1, p2, '');
  };

  const submitScore = async (player1Games: number, player2Games: number, tiebreakScore: string) => {
    if (!expandedMatchId) return;
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: expandedMatchId,
          player1Games,
          player2Games,
          tiebreakScore: tiebreakScore || undefined,
        }),
      });
      if (res.ok) {
        setExpandedMatchId(null);
        setShowCustom(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 1000);
        fetchMatches();
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  };

  const handleSubmitCustom = () => {
    submitScore(customP1, customP2, customTiebreak);
  };

  const playerName = typeof window !== 'undefined' ? localStorage.getItem('playerName') : null;
  const hasCompletedMatches = matches.some((m) => m.status === 'completed');
  const activeMatches = matches.filter((m) => m.status === 'in_progress' || m.status === 'pending');

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-24 pt-6">
      {/* Green flash overlay */}
      {flash && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-[#22c55e]/20 animate-pulse" />
      )}

      {/* Header */}
      <h1 className="font-black text-xl tracking-widest text-white mb-6">SCORE</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#22c55e] animate-spin" />
        </div>
      ) : activeMatches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-4">🎾</div>
          <p className="text-lg font-semibold text-white mb-2">No active matches</p>
          <p className="text-sm text-white/50 max-w-xs">
            {hasCompletedMatches
              ? 'Your completed matches appear here'
              : 'You will be matched automatically once the session starts'}
          </p>
        </div>
      ) : (
        /* Match List */
        <div className="space-y-3">
          {activeMatches.map((match) => (
            <div key={match.id}>
              <MatchCard
                match={match}
                variant={getVariant(match.status)}
                expanded={expandedMatchId === match.id}
                onScore={
                  match.status === 'in_progress' || match.status === 'pending'
                    ? () => handleToggle(match.id)
                    : undefined
                }
              >
                {/* Inline Score Entry */}
                {expandedMatchId === match.id && (
                  <div className="space-y-3">
                    {/* Quick Score Presets */}
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_SCORES.map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handlePresetScore(score)}
                          className="bg-white/5 border border-white/10 rounded-lg py-2 text-sm font-semibold text-white hover:bg-[#22c55e]/10 hover:border-[#22c55e]/30 transition-all"
                        >
                          {score}
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10" />

                    {/* Custom Toggle */}
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowCustom(!showCustom)}
                      className="w-full"
                    >
                      Custom
                    </ActionButton>

                    {/* Custom Score Inputs */}
                    {showCustom && (
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-white/50 mb-1">
                              {match.player1?.name || 'Player 1'} Games
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={7}
                              value={customP1}
                              onChange={(e) => setCustomP1(Number(e.target.value))}
                              className="bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white text-center focus:outline-none focus:border-[#22c55e]/50 w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/50 mb-1">
                              {match.player2?.name || 'Player 2'} Games
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={7}
                              value={customP2}
                              onChange={(e) => setCustomP2(Number(e.target.value))}
                              className="bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white text-center focus:outline-none focus:border-[#22c55e]/50 w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-white/50 mb-1">
                            Tiebreak Score (optional)
                          </label>
                          <input
                            type="text"
                            value={customTiebreak}
                            onChange={(e) => setCustomTiebreak(e.target.value)}
                            placeholder="e.g. 7-4"
                            className="bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white text-center focus:outline-none focus:border-[#22c55e]/50 w-full"
                          />
                        </div>
                        <ActionButton
                          variant="primary"
                          onClick={handleSubmitCustom}
                          className="w-full mt-3 uppercase tracking-wide text-sm"
                        >
                          Submit Result
                        </ActionButton>
                      </div>
                    )}
                  </div>
                )}
              </MatchCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
