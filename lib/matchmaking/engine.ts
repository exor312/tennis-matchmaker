import type { Player, Format } from "@/types";

interface Pairing {
  player1_id: string;
  player2_id: string;
  player3_id: string | null;
  player4_id: string | null;
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomPairing(players: Player[], format: Format): Pairing[] {
  const shuffled = shuffle(players);
  const pairings: Pairing[] = [];

  if (format === "singles") {
    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      pairings.push({
        player1_id: shuffled[i].id,
        player2_id: shuffled[i + 1].id,
        player3_id: null,
        player4_id: null,
      });
    }
  } else {
    // doubles/mix: groups of 4
    for (let i = 0; i + 3 < shuffled.length; i += 4) {
      pairings.push({
        player1_id: shuffled[i].id,
        player2_id: shuffled[i + 1].id,
        player3_id: shuffled[i + 2].id,
        player4_id: shuffled[i + 3].id,
      });
    }
  }

  return pairings;
}

export function skillBasedPairing(players: Player[], format: Format): Pairing[] {
  const sorted = [...players].sort((a, b) => a.skill_level - b.skill_level);
  const pairings: Pairing[] = [];

  if (format === "singles") {
    // Pair adjacent skill levels for closest matches
    for (let i = 0; i + 1 < sorted.length; i += 2) {
      pairings.push({
        player1_id: sorted[i].id,
        player2_id: sorted[i + 1].id,
        player3_id: null,
        player4_id: null,
      });
    }
  } else {
    // Best 4-player balance: pair highest+lowest with middle two
    let left = 0;
    let right = sorted.length - 1;
    while (right - left >= 3) {
      pairings.push({
        player1_id: sorted[left].id,
        player2_id: sorted[left + 1].id,
        player3_id: sorted[right - 1].id,
        player4_id: sorted[right].id,
      });
      left += 2;
      right -= 2;
    }
  }

  return pairings;
}

export function roundRobin(playerIds: string[]): [string, string][] {
  const rounds: [string, string][] = [];
  const n = playerIds.length;

  // Round-robin circle method
  const players = [...playerIds];
  if (n % 2 !== 0) players.push("BYE");

  const numPlayers = players.length;

  for (let round = 0; round < numPlayers - 1; round++) {
    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = players[i];
      const p2 = players[numPlayers - 1 - i];
      if (p1 !== "BYE" && p2 !== "BYE") {
        rounds.push([p1, p2]);
      }
    }
    // Rotate: keep first player fixed, rotate the rest
    players.splice(1, 0, players.pop()!);
  }

  return rounds;
}


