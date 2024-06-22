import { hash, compare } from 'bcryptjs'
import {sign, verify, decode, JwtPayload} from 'jsonwebtoken'
import {PasswordNotMatchingException} from "@/server/errors/password_not_matching";
import {IUser} from "@/server/entities/iam/user";
import {cookies} from "next/headers";

const SALT_ROUND = +process.env.SALT_ROUND ?? 10
const JWT_SECRET = process.env.JWT_SECRET

// 3 hours
export const JWT_MAX_AGE_S = 3 * 60 * 60

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUND)
}

export async function isPasswordMatchingHash(password: string, hash: string): Promise<void> {
  return compare(password, hash).then(isMatching => {
    if (!isMatching) {
      throw new PasswordNotMatchingException()
    }
  })
}

export async function createJWT(payload: Record<string, any>): Promise<string> {
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_MAX_AGE_S
  })
}

export async function verifyJWT(token: string): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    return verify(token, JWT_SECRET, (error, decoded: JwtPayload) => {
      if (error) {
        return reject(error)
      }

      return resolve(decoded as Record<string, any>)
    })
  })
}

export async function getUserFromTokenAndRenew(token: string): Promise<IUser|null> {
  // si le token n'est pas présent, on renvoie une erreur 401
  if (!token) {
    return null
  }

  // vérification du token
  const payload = await verifyJWT(token).catch(() => null);

  // si le token n'est pas valide, on renvoie une erreur 401
  if (!payload) {
    return null
  }

  const { username, user__id, steam_username } = payload
  const newJWT = await createJWT({ username, user__id, steam_username })

  cookies().set('mechaToken', newJWT, { httpOnly: true, maxAge: JWT_MAX_AGE_S })

  return payload
}
