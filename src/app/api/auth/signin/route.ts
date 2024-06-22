import {type NextRequest, NextResponse} from "next/server";
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {createJWT, isPasswordMatchingHash, JWT_MAX_AGE_S} from "@/server/services/auth";
import { cookies } from 'next/headers'
import {PasswordNotMatchingException} from "@/server/errors/password_not_matching";

export async function POST(request: NextRequest) {
  const bodyPayload = await request.json()
  const username = bodyPayload.username
  const password = bodyPayload.password

  return UserRepository.getUserByUsername(username, true)
    .then(async ({ password: password_hash, username, user__id, steam_username }) => {
      return isPasswordMatchingHash(password, password_hash)
        .then(() => createJWT({username, user__id, steam_username}))
        .then(token => {
          cookies().set('mechaToken', token, { httpOnly: true, maxAge: JWT_MAX_AGE_S })
          return NextResponse.json({data: null}, { status: 200 })
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