import {NextRequest, NextResponse} from "next/server";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {MatchMaker} from "@/server/services/matchmaker";
import {Round} from "@/server/entities/tournament/round";
import {AlreadyGeneratingMatch} from "@/server/errors/already_generating_match";
import {TournamentAlreadyWon} from "@/server/errors/tournament_already_won";
import {EntityNotFoundException} from "@/server/errors/not_found";

async function startMatchMaking(tournamentId: string): Promise<Round[]> {
  return MatchMaker.newGeneration(tournamentId)
    .then(rounds => {
      // si on a des rounds retourner par le matchmaker, on les inserts
      return Promise.all(rounds.map(round => RoundRepository.createRound(round)))
    })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return RoundRepository.isStageFinished(params.id)
    .then((isStagesFinished) => {
      console.log('isStagesFinished', isStagesFinished)
      // si tout les stages sont fini (ou non démarré), on lance le matchmaking
      if (isStagesFinished) {
        return startMatchMaking(params.id)
      }
    })
    .then(() => {
      // on essaye de check-in le joueur et de retourner le round actuel
      return RoundRepository.updateCheckinPlayer(params.id, user.user__id)
    })
    .then((round: Round) => {
      return NextResponse.json({ data: round.toJson() }, { status: 200 })
    })
    .catch((error) => {
      if (error instanceof AlreadyGeneratingMatch) {
        return NextResponse.json({}, { status: 202 })
      }

      if (error instanceof TournamentAlreadyWon || error instanceof EntityNotFoundException) {
        return new Response(null, { status: 204 })
      }

      return NextResponse.json({ error: error.message, data: null }, { status: 404 })
    })
}
