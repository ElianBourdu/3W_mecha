import {type NextRequest, NextResponse} from "next/server";
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";

export async function POST(request: NextRequest) {
  const bodyPayload = await request.json()
  const username = bodyPayload.username
  const password = bodyPayload.password
  const steam_username = bodyPayload.steam_username

  return UserRepository.getUserByUsername(username)
    .then(async user => {
      if (user) {
        return NextResponse.json({ error: 'User with this username already exists' }, { status: 400 })
      }

      return UserRepository.createUser({
        username,
        password,
        steam_username,
      })
    })
    .then(isInsertionSuccess => {
      if (isInsertionSuccess) {
        return NextResponse.json(null, { status: 201 })
      }

      throw new Error('error while creating the user')
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}