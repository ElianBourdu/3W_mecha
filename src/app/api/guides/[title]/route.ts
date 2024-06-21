import { type NextRequest, NextResponse } from 'next/server'
import {EntityNotFoundException} from "@/server/errors/not_found";
import {GuideRepository} from "@/server/repositories/guide/guide_repository";
import {UserRepository} from "@/server/repositories/iam/user_repository";
import {getUserFromTokenAndRenew} from "@/server/services/auth";

export async function GET(request: NextRequest, { params }: { params: { title: string } }) {
  const includes = request.nextUrl.searchParams.getAll('includes') ?? []

  return GuideRepository.getGuideByTitle(params.title)
    .then((guide) => {
      if (includes.includes('user')) {
        return UserRepository.getUserById(guide.user__id).then(user => {
          guide.user = user
          return guide.toJson()
        })
      }
      return guide.toJson()
    })
    .then((guide) => {
      return Response.json({ data: guide })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}

export async function DELETE(request: NextRequest,  { params }: { params: { title: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return GuideRepository.getGuideByTitle(params.title)
    .then((guide) => {
      if (guide.user__id !== user.user__id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return GuideRepository.delete(guide.guide__id)
        .then(() => {
          return new Response(null, { status: 204 })
        })
        .catch((error: Error) => {
          if (error instanceof EntityNotFoundException) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
          }

          return NextResponse.json({error: error.message}, {status: 500})
        })
    })
}
