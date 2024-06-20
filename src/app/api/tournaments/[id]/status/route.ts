import {NextRequest, NextResponse} from "next/server";
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {Round} from "@/server/entities/tournament/round";

export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
  return Promise.all([
    TournamentRepository.getSortedUsersVictories(params.id),
    RoundRepository.getTournamentRounds(params.id)
  ]).then(([users_victories, rounds]) => {

    const is_running = users_victories[0].victories === users_victories[1].victories

    const stages = rounds.reduce((acc, round) => {
      acc[round.stage] = (acc[round.stage] ?? [])
      acc[round.stage].push(round)
      return acc
    }, {} as Record<number, Round[]>)

    return NextResponse.json({
      data: {
        status: is_running ? 'running' : 'done',
        stages,
        users_victories
      }
    }, { status: 200 })
  })
}
