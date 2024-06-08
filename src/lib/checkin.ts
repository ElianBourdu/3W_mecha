import {IRound} from "@/server/entities/tournament/round";
import {api} from "@/lib/api";

export async function checkin(tournament__id: string): Promise<IRound> {
  return api<IRound>(`/api/tournaments/${tournament__id}/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function callWinnerInRound(tournament__id: string, round__id: string, user__id: string): Promise<IRound> {
  return api<IRound>(`/api/tournaments/${tournament__id}/rounds/${round__id}/declare-winner`, {
    method: 'POST',
    body: JSON.stringify({
      winning_user_id: user__id
    })
  })
}
