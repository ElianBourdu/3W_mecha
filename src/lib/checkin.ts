import {IRound} from "@/server/entities/tournament/round";

export async function checkin(tournament__id: string): Promise<IRound> {
  return fetch(`http://localhost:3000/api/tournaments/${tournament__id}/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      if (!res.ok) {
        console.log(res)
        throw new Error('Failed to check-in')
      }
      return res.json()
    })
    .then(json => json.data)
}

export function callWinnerInRound(tournament__id: string, round__id: string, user__id: string) {
  return fetch(`/api/tournaments/${tournament__id}/rounds/${round__id}`, {
    method: 'POST',
    body: JSON.stringify({
      winning_user_id: user__id
    })
  }).then(res => res.json())
}
