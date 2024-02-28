import {type NextRequest, NextResponse} from "next/server";
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {createJWT, isPasswordMatchingHash} from "@/server/services/auth";
import { cookies } from 'next/headers'
import {PasswordNotMatchingException} from "@/server/errors/password_not_matching";

export async function POST(request: NextRequest) {
  const bodyPayload = await request.json()
  const username = bodyPayload.username
  const input_password = bodyPayload.password

  return UserRepository.getUserByUsername(username, true)
    .then(async ({ password, username, user__id, steam_username }) => {
      return isPasswordMatchingHash(input_password, password)
        .then(() => createJWT({username, user__id, steam_username}))
        .then(token => {
          cookies().set('token', token, { httpOnly: true })
        })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error instanceof PasswordNotMatchingException) {
        return NextResponse.json({ error: "Wrong username or password" }, { status: 400 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}