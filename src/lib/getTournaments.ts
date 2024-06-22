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
  return api<ITournament[]>(`/api/tournaments?${stringParams}`)
    .then(tournaments => tournaments.map((tournament: ITournament) => ({
      ...tournament,
      start_at: new Date(tournament.start_at)
    })))
}

export async function getTournamentById(id: string): Promise<ITournament> {
  return api<ITournament>(`/api/tournaments/${id}?includes=user`)
    .then(tournament => ({
      ...tournament,
      start_at: new Date(tournament.start_at)
    }))
}

export async function getTournamentPlayers(id: string): Promise<IUser[]> {
  return api<IUser[]>(`/api/tournaments/${id}/players`)
}

export async function getMyTournaments(): Promise<ITournament[]> {
  return api<ITournament[]>('/api/tournaments/mine')
}

type Status = {
  status: 'done' | 'running',
  stages: Record<number, IRound[]>,
  users_victories: { victories: number, user: IUser }[]
}

export async function getTournamentResults(id: string): Promise<Status> {
  return api<Status>(`/api/tournaments/${id}/status`)
}
