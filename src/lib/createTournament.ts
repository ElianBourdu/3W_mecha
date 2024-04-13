import {ITournament} from "@/server/entities/tournament/tournament";

export async function createTournament(tournament: Omit<ITournament, 'owner__id' | 'tournament__id'>): Promise<ITournament> {
  return fetch('/api/tournaments', {
    body: JSON.stringify(tournament),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to create tournament')
      }
      return res.json()
    })
    .then(json => {
      return json.data
    })
}
