import {ITournament} from "@/server/entities/tournament/tournament";
import {api} from "@/lib/api";

export async function createTournament(tournament: Omit<ITournament, 'owner__id' | 'tournament__id'>): Promise<ITournament> {
  return api<ITournament>('/api/tournaments', {
    body: JSON.stringify(tournament),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
