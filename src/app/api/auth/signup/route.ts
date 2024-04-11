import {type NextRequest, NextResponse} from "next/server";
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import Joi from "joi";
import {hashPassword} from "@/server/services/auth";
import {EntityAlreadyExists} from "@/server/errors/entity_already_exists";

const schema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(255)
    .alphanum()
    .required(),

  password: Joi.string()
    .min(4)
    .max(255)
    .required(),

  steam_username: Joi.string()
    .min(3)
    .max(32)
})

export async function POST(request: NextRequest) {
  const bodyPayload = await request.json()
  const { error, value } = schema.validate(bodyPayload)
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  const username = value.username
  const password = value.password
  const steam_username = value.steam_username

  return UserRepository.getUserByUsername(username, false, false)
    .then(async user => {
      if (user) {
        throw new EntityAlreadyExists()
      }

      return hashPassword(password)
    })
    .then((hashedPassword) => {
      return UserRepository.createUser({
        username,
        steam_username,
        password: hashedPassword,
      })
    })
    .then(isInsertionSuccess => {
      if (isInsertionSuccess) {
        return NextResponse.json({data: null}, { status: 201 })
      }

      throw new Error('error while creating the user')
    })
    .catch((error) => {
      if (error instanceof EntityAlreadyExists) {
        NextResponse.json({ error: 'User with this username already exists' }, { status: 400 })
      }

      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}