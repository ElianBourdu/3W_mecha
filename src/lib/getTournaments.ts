'use server'

import {IUser} from "@/server/entities/iam/user";
import {ITournament} from "@/server/entities/tournament/tournament";

export type TournamentWithUser = ITournament & { user: IUser }

export async function getTournaments(params: any = {}): Promise<TournamentWithUser[]> {
  const urlParams = {
    includes: 'user',
    ...params
  }
  const stringParams = new URLSearchParams(urlParams).toString()
  return fetch(`http://localhost:3000/api/tournaments?${stringParams}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get tournaments')
      }
      return res.json()
    })
    .then(json => json.data)
}

export async function getTournamentById(id: string): Promise<ITournament & { user: IUser }> {
  return fetch(`http://localhost:3000/api/tournaments/${id}?includes=user`)
    .then(res => res.json())
    .then(json => json.data)
}
