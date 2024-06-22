import {NextRequest, NextResponse} from "next/server";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {getUserFromTokenAndRenew} from "@/server/services/auth";

export async function POST(request: NextRequest,  { params }: { params: { round_id: string, id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return RoundRepository.getCurrentRound(params.id, user.user__id, true)
    .then((round) => {
      const user_is_first_player = round.first_player__id === user.user__id
      const first_player_checked = round.first_player_checkin !== null
      const second_player_checked = round.second_player_checkin !== null
      const five_minutes_passed = round.start_at.getTime() < (new Date(Date.now() - 5 * 60 * 1000)).getTime()

      if (!five_minutes_passed) {
        return NextResponse.json({ error: 'Five minutes have not passed yet' }, { status: 400 })
      }

      if (user_is_first_player && first_player_checked && !second_player_checked) {
        return Promise.all([
          RoundRepository.registerPlayerResult(params.round_id, user.user__id, true),
          RoundRepository.registerPlayerResult(params.round_id, round.second_player__id, false),
          RoundRepository.updateCheckinPlayer(params.id, round.second_player__id)
        ]).then(() => {
          return new Response(null, { status: 204 })
        })
      }

      if (!user_is_first_player && !first_player_checked && second_player_checked) {
        return Promise.all([
          RoundRepository.registerPlayerResult(params.round_id, user.user__id, true),
          RoundRepository.registerPlayerResult(params.round_id, round.first_player__id, false),
          RoundRepository.updateCheckinPlayer(params.id, round.first_player__id)
        ]).then(() => {
          return new Response(null, { status: 204 })
        })
      }

      return new Response(null, { status: 204 })
    })
    .catch((error: Error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: 'round not found' }, { status: 404 })
      }

      return NextResponse.json({error: error.message}, {status: 500})
    })
}
