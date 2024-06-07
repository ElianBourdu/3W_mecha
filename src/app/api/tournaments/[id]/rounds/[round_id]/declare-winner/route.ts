import {NextRequest, NextResponse} from "next/server";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {getUserFromToken} from "@/server/services/auth";
import Joi from "joi";

const schema = Joi.object({
  winning_user_id: Joi.string()
    .uuid()
    .required(),
})

export async function POST(request: NextRequest,  { params }: { params: { round_id: string, id: string } }) {
  const user = await getUserFromToken(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { error, value } = schema.validate(body)
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  const is_user_winning = value.winning_user_id === user.user__id;

  return RoundRepository.registerPlayerResult(params.round_id, user.user__id, is_user_winning)
    .then((round) => {
      return NextResponse.json({ data: round.toJson() }, { status: 200 })
    })
    .catch((error: Error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
      }

      return NextResponse.json({error: error.message}, {status: 500})
    })
}
