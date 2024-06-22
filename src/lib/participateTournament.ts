import {ITournament} from "@/server/entities/tournament/tournament";
import {api} from "@/lib/api";

export async function participateTournament(tournament__id: string): Promise<ITournament> {
  return api(`/api/tournaments/${tournament__id}/participate`, {
    body: null,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
