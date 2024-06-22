import { type NextRequest, NextResponse } from 'next/server'
import {EntityNotFoundException} from "@/server/errors/not_found";
import {GuideRepository} from "@/server/repositories/guide/guide_repository";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {CommentRepository} from "@/server/repositories/guide/comment_repository";
import Joi from "joi";

const schema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .required(),
})

export async function GET(request: NextRequest, { params }: { params: { title: string } }) {
  return GuideRepository.getGuideByTitle(params.title)
    .then((guide) => {
      return CommentRepository.getMessagesOfGuide(guide.guide__id)
    })
    .then((comments) => {
      return Response.json({ data: comments.map(comment => comment.toJson()) })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}

export async function POST(request: NextRequest, { params }: { params: { title: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bodyPayload = await request.json()

  const { error, value } = schema.validate(bodyPayload)
  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  const content = value.content

  return GuideRepository.getGuideByTitle(params.title)
    .then((guide) => {
      return CommentRepository.create(guide.guide__id, user.user__id, content)
    })
    .then((comment) => {
      return Response.json({ data: comment.toJson() }, { status: 201 })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}
