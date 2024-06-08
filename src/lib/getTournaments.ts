import {IUser} from "@/server/entities/iam/user";
import {ITournament} from "@/server/entities/tournament/tournament";
import {IRound} from "@/server/entities/tournament/round";
import {api} from "@/lib/api";

export async function getTournaments(params: any = {}): Promise<ITournament[]> {
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
  return fetch(`http://localhost:3000/api/tournaments/${id}/players`, {
    cache: 'no-cache'
  })
    .then(res => res.json())
    .then(json => json.data)
}

export async function getMyTournaments(): Promise<ITournament[]> {
  return fetch('http://localhost:3000/api/tournaments/mine')
    .then(res => res.json())
    .then(json => json.data)
}

export async function getTournamentResults(id: string): Promise<{
  status: 'done' | 'running',
  stages: Record<number, IRound[]>,
  users_victories: { victories: number, user: IUser }[]
}> {
  return api(`/api/tournaments/${id}/status`)
}
