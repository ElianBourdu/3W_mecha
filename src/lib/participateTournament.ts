import {ITournament} from "@/server/entities/tournament/tournament";

export async function participateTournament(tournament__id: string): Promise<ITournament> {
  return fetch(`/api/tournaments/${tournament__id}/participate`, {
    body: null,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to participate to tournament')
      }
      return res.json()
    })
    .then(json => {
      return json.data
    })
}
