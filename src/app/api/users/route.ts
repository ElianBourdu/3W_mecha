import {type NextRequest, NextResponse} from 'next/server'
import {UserRepository} from "@/server/repositories/iam/user_repository";

export async function GET(request: NextRequest) {
  return UserRepository.getAllUsers()
    .then((userList) => {
      return Response.json({
        data: userList.map(user => user.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}
