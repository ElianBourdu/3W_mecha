import {type NextRequest, NextResponse} from 'next/server'
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";

export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
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
