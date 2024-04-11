import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import assert from 'assert'
import {PasswordNotMatchingException} from "@/server/errors/password_not_matching";

const SALT_ROUND = +process.env.SALT_ROUND ?? 10
const JWT_SECRET = process.env.JWT_SECRET

assert(JWT_SECRET)

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
    expiresIn: '1h'
  })
}
