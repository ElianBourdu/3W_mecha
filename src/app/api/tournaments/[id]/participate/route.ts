import {NextRequest, NextResponse} from "next/server";
import {getUserFromToken} from "@/server/services/auth";
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {EntityAlreadyExists} from "@/server/errors/entity_already_exists";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromToken(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: gérer le cas ou il participe déjà a un tournoi sur la plage horaire calculée

  return TournamentRepository.makeParticipate(params.id, user.user__id)
    .then(() => {
      return Response.json({data: null}, {status: 201})
    })
    .catch((error: Error) => {
      if (error instanceof EntityAlreadyExists) {
        return NextResponse.json({error: 'Player already participate to this tournament'}, {status: 409})
      }

      return NextResponse.json({error: error.message}, {status: 500})
    })
}
