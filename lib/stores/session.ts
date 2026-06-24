"use client";

import { create } from "zustand";
import type { Session, Player, Match, MatchResult } from "@/types";

interface SessionState {
  currentSession: Session | null;
  players: Player[];
  matches: Match[];
  results: MatchResult[];
  setCurrentSession: (session: Session) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  addMatch: (match: Match) => void;
  updateMatchStatus: (matchId: string, status: Match["status"]) => void;
  addResult: (result: MatchResult) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  players: [],
  matches: [],
  results: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
  removePlayer: (playerId) =>
    set((state) => ({ players: state.players.filter((p) => p.id !== playerId) })),
  setPlayers: (players) => set({ players }),
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
  updateMatchStatus: (matchId, status) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, status } : m
      ),
    })),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),
  clearSession: () =>
    set({ currentSession: null, players: [], matches: [], results: [] }),
}));
