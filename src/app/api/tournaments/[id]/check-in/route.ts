import {NextRequest, NextResponse} from "next/server";
import {getUserFromToken} from "@/server/services/auth";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {matchMaker} from "@/server/services/tournament";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return RoundRepository.getCurrentRound(params.id, user.user__id)
    .then((round) => {
      return NextResponse.json({data: round.toJson()})
    })
    .catch(async (error: Error) => {
      if (error instanceof EntityNotFoundException) {
        // si il n'y a pas de round a "check-in", peut-etre que tout les matchs sont fini,
        // on essaye donc de lancé les nouveaux matchs, pas besoin de gérer les cas
        // d'erreur ici, c'est soit un problème de de tournoi en cours, soit une erreur d'entrée des joueurs
        return matchMaker(params.id)
          .then(rounds => {
            // si on a des rounds retourner par le matchmaker, on les inserts
            return Promise.all(rounds.map(round => RoundRepository.createRound(round)))
          })
          .then(rounds => {
            // puis on trouve notre round ou l'utilisateur courant est impliqué
            return rounds.find(round =>
              round.first_player__id === user.user__id || round.second_player__id === user.user__id)
          })
          .then(round => {
            return NextResponse.json({ data: round.toJson() }, { status: 200 })
          })
          .catch((error) => {
            return NextResponse.json({ error: error.message }, { status: 404 })
          })
      }
      return NextResponse.json({ error: error.message }, {status: 500})
    })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }


}