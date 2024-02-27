import { type NextRequest, NextResponse } from 'next/server'
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {isUUID} from "@/server/validators/is_uuid";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isUUID(params.id)) {
    return NextResponse.json({error: `invalid uuid: ${params.id}`}, { status: 400})
  }
  return UserRepository.getUserById(params.id)
    .then((user) => {
      return Response.json({
        data: user.toJson()
      })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}
