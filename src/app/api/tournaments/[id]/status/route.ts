import {NextRequest, NextResponse} from "next/server";
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {Round} from "@/server/entities/tournament/round";
import {getPlayersVictoriesAndDefeats, getRoundsByStages} from "@/server/services/tournament";
import {User} from "@/server/entities/iam/user";

export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
  return Promise.all([
    RoundRepository.getTournamentRounds(params.id),
    TournamentRepository.getTournamentPlayers(params.id)
  ]).then(([rounds, players]) => {
    const users_victories = getPlayersVictoriesAndDefeats(rounds)
    const userById = players.reduce((acc, player) => {
      acc[player.user__id] = player
      return acc
    }, {} as Record<string, User>)

    if (rounds.length === 0 || users_victories.length === 0) {
      return NextResponse.json({
        data: {
          status: 'running',
          stages: {},
          users_victories
        }
      }, { status: 200 })
    }

    const max_stage = Math.max(...rounds.map(round => round.stage))

    const userWithVictories = users_victories
      // ajout des victoires par défaut pour les joueurs n'ayant pas joué tout les rounds
      .map(user => ({
        victories: user.victories + (max_stage - (user.victories + user.defeats)),
        user: userById[user.user__id]
      }))
      // tri des joueurs par nombre de victoires
      .sort((a, b) => b.victories - a.victories)

    const is_running = userWithVictories[0].victories === userWithVictories[1].victories
    const stages = getRoundsByStages(rounds)

    return NextResponse.json({
      data: {
        status: is_running ? 'running' : 'done',
        stages,
        users_victories: userWithVictories
      }
    }, { status: 200 })
  })
}
