import {IRound} from "@/server/entities/tournament/round";
import {api} from "@/lib/api";

export async function checkin(tournament__id: string): Promise<IRound> {
  return api<IRound>(`/api/tournaments/${tournament__id}/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(round => {
    if (!round) return round
    round.start_at = new Date(round.start_at)
    round.first_player_checkin = round.first_player_checkin ? new Date(round.first_player_checkin) : null
    round.second_player_checkin = round.second_player_checkin ? new Date(round.second_player_checkin) : null
    return round
  })
}

export function callWinnerInRound(tournament__id: string, round__id: string, user__id: string): Promise<IRound> {
  return api<IRound>(`/api/tournaments/${tournament__id}/rounds/${round__id}/declare-winner`, {
    method: 'POST',
    body: JSON.stringify({
      winning_user_id: user__id
    })
  })
    .then(round => {
      if (!round) return round
      round.start_at = new Date(round.start_at)
      round.first_player_checkin = round.first_player_checkin ? new Date(round.first_player_checkin) : null
      round.second_player_checkin = round.second_player_checkin ? new Date(round.second_player_checkin) : null
      return round
    })
}

export function ask_forfeit(tournament__id: string, round__id: string): Promise<IRound> {
  return api(`/api/tournaments/${tournament__id}/rounds/${round__id}/ask-forfeit`, {
    method: 'POST',
  })
}
