'use server'

import {IUser} from "@/server/entities/iam/user";
import {ITournament} from "@/server/entities/tournament/tournament";

export async function getTournaments(params: any = {}): Promise<ITournament[]> {
  const urlParams = {
    includes: 'user',
    ...params
  }
  const stringParams = new URLSearchParams(urlParams).toString()
  return fetch(`http://localhost:3000/api/tournaments?${stringParams}`)
    .then(res => {
      if (!res.ok) {
        console.error(res)
        throw new Error('Failed to get tournaments')
      }

      return res.json()
    })
    .then(json => json.data.map((tournament: ITournament) => ({
      ...tournament,
      start_at: new Date(tournament.start_at)
    })))
}

export async function getTournamentById(id: string): Promise<ITournament> {
  return fetch(`http://localhost:3000/api/tournaments/${id}?includes=user`)
    .then(res => res.json())
    .then(json => ({
      ...json.data,
      start_at: new Date(json.data.start_at)
    }))
}

export async function getTournamentPlayers(id: string): Promise<IUser[]> {
  return fetch(`http://localhost:3000/api/tournaments/${id}/players`)
    .then(res => res.json())
    .then(json => json.data)
}
