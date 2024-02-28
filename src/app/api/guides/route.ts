import {GuideRepository} from "@/server/repositories/guide/guide_repository";
import {NextResponse} from "next/server";

export async function GET() {
  return GuideRepository.getAllGuides()
    .then(guideList => {
      return Response.json({
        data: guideList.map(guide => guide.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({error: error.message}, {status: 500})
    })
}
