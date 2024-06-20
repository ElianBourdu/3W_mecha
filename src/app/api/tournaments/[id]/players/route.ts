import {NextRequest, NextResponse} from "next/server";
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";

export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
  return TournamentRepository.getTournamentPlayers(params.id)
    .then((userList) => {
      return Response.json({
        data: userList.map(user => user.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}