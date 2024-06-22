import {NextRequest, NextResponse} from "next/server";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {MatchMaker} from "@/server/services/tournament";
import {Round} from "@/server/entities/tournament/round";
import {StageNotFinished} from "@/server/errors/stage_not_finished";
import {AlreadyGeneratingMatch} from "@/server/errors/already_generating_match";
import {TournamentAlreadyWon} from "@/server/errors/tournament_already_won";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return RoundRepository.getCurrentRound(params.id, user.user__id, false)
    .then((round: Round) => {
      return RoundRepository.updateCheckinPlayer(params.id, user.user__id)
    })
    .then((round: Round) => {
      return NextResponse.json({data: round.toJson()})
    })
    .catch(async (error: Error) => {
      if (error instanceof EntityNotFoundException) {
        // si il n'y a pas de round a "check-in", peut-etre que tout les matchs sont fini,
        // on essaye donc de lancé les nouveaux matchs, pas besoin de gérer les cas
        // d'erreur ici, c'est soit un problème de de tournoi en cours, soit une erreur d'entrée des joueurs
        return MatchMaker.newGeneration(params.id)
          .then(rounds => {
            // si on a des rounds retourner par le matchmaker, on les inserts
            return Promise.all(rounds.map(round => RoundRepository.createRound(round)))
          })
          .then(() => {
            // puis on update notre checkin pour l'utilisateur concerné
            return RoundRepository.updateCheckinPlayer(params.id, user.user__id)
          })
          .then((round: Round) => {
            return NextResponse.json({ data: round.toJson() }, { status: 200 })
          })
          .catch((error) => {
            if (error instanceof StageNotFinished) {
              return RoundRepository.getCurrentRound(params.id, user.user__id, true)
                .then((round: Round) => {
                  return NextResponse.json({ data: round.toJson() }, { status: 200 })
                })
            }

            // si un matchmaking est en cours de traitement, juste informer le client
            if (error instanceof AlreadyGeneratingMatch) {
              return NextResponse.json({}, { status: 202 })
            }

            if (error instanceof TournamentAlreadyWon) {
              return new Response(null, { status: 204 })
            }

            return NextResponse.json({ error: error.message, data: null }, { status: 404 })
          })
      }
      return NextResponse.json({ error: error.message }, {status: 500})
    })
}
