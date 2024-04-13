import { type NextRequest, NextResponse } from 'next/server'
import {EntityNotFoundException} from "@/server/errors/not_found";
import {GuideRepository} from "@/server/repositories/guide/guide_repository";

export async function GET(request: NextRequest, { params }: { params: { title: string } }) {
  return GuideRepository.getGuideByTitle(params.title)
    .then((guide) => {
      return Response.json({
        data: guide.toJson()
      })
    })
    .catch((error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}
