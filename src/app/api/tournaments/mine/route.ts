import {NextRequest, NextResponse} from "next/server";
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {getUserFromTokenAndRenew} from "@/server/services/auth";

export async function GET(request: NextRequest) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // const page = +(request.nextUrl.searchParams.get('page') ?? 1)
  // const limit = +(request.nextUrl.searchParams.get('limit') ?? 10)

  return TournamentRepository.getTournamentJoinedByPlayer(user.user__id)
    .then((tournamentList) => {
      return Response.json({
        data: tournamentList.map(tournament => tournament.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}
