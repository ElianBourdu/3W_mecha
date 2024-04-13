import { type NextRequest, NextResponse } from 'next/server'
import {EntityNotFoundException} from "@/server/errors/not_found";
import {GuideRepository} from "@/server/repositories/guide/guide_repository";

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
