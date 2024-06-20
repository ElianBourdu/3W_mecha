import {type NextRequest, NextResponse} from 'next/server'
import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import Joi from "joi";
import {getUserFromTokenAndRenew} from "@/server/services/auth";

const schema = Joi.object({
  name: Joi.string()
    .min(6)
    .max(255)
    .required(),

  max_players: Joi.number()
    .min(2)
    .max(64)
    .required(),

  start_at: Joi.date()
    .min(new Date(Date.now() + 1000 * 60 * 2))
    .max(new Date(Date.now() + 1000 * 60 * 60 * 24 * 31))
    .required()
})

export async function GET(request: NextRequest) {
  const page = +(request.nextUrl.searchParams.get('page') ?? 1)
  const limit = +(request.nextUrl.searchParams.get('limit') ?? 10)
  const includeClosed = !!(request.nextUrl.searchParams.get('include_closed') ?? false)

  return TournamentRepository.getAllTournaments(limit, (page - 1) * limit, includeClosed)
    .then((tournamentList) => {
      return Response.json({
        data: tournamentList.map(tournament => tournament.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}

export async function POST(request: NextRequest) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { error, value } = schema.validate(body)
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  value.owner__id = user.user__id
  return TournamentRepository.createTournament(value)
    .then((tournament) => {
      return Response.json({data: tournament.toJson()}, {status: 201})
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}
