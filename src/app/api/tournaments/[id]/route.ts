import {type NextRequest, NextResponse} from 'next/server'
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return TournamentRepository.getTournamentById(params.id)
    .then((tournament) => {
      return Response.json({
        data: tournament.toJson()
      })
    })
    .catch((error: Error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
      }

      return NextResponse.json({error: error.message}, {status: 500})
    })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return TournamentRepository.getTournamentById(params.id)
    .then((tournament) => {
      if (tournament.owner__id !== user.user__id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return RoundRepository.deleteAllRounds(params.id)
        .then(() => TournamentRepository.delete(params.id))
        .then(() => {
          return new Response(null, { status: 204 })
        })
        .catch((error: Error) => {
          if (error instanceof EntityNotFoundException) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
          }

          return NextResponse.json({error: error.message}, {status: 500})
        })
    })
}
