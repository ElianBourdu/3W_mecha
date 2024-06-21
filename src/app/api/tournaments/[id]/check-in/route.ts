import {NextRequest, NextResponse} from "next/server";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {MatchMaker} from "@/server/services/tournament";
import {Round} from "@/server/entities/tournament/round";
import {StageNotFinished} from "@/server/errors/stage_not_finished";
import {sleep} from "@/server/util/sleep";
import {StreamingResponse} from "@/server/util/streamingResponse";
import {makeStream} from "@/server/util/makeStream";
import {AlreadyGeneratingMatch} from "@/server/errors/already_generating_match";
import {TournamentAlreadyWon} from "@/server/errors/tournament_already_won";

async function *fetchUncheckedRoundByOpponant(tournament__id: string, user__id: string): AsyncGenerator<boolean> {
  let loopCount = 0
  // on attend au moins 3 min, après ca ne sert plus à rien d'attendre
  while (loopCount++ < 180) {
    await sleep(1000)
    const round = await RoundRepository.getCurrentRound(tournament__id, user__id, true)
    // check BDD de first_player_checkin et second_player_checkin
    if (round.first_player__id === user__id) {
      yield round.second_player_checkin !== null
    } else {
      yield round.first_player_checkin !== null
    }
  }
}

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // variable tampon avec fetchUncheckedRoundByOpponant
  try {
    const generator = fetchUncheckedRoundByOpponant(params.id, user.user__id)
    const stream = makeStream(generator)
    return new StreamingResponse(stream)
  } catch (error) {
    if (error instanceof EntityNotFoundException) {
      return NextResponse.json({error: error.message}, {status: 404})
    }
    return NextResponse.json({ error: error.message }, {status: 500})
  }
}