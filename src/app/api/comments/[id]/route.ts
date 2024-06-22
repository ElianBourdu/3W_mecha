import {NextRequest, NextResponse} from "next/server";
import {getUserFromTokenAndRenew} from "@/server/services/auth";
import {GuideRepository} from "@/server/repositories/guide/guide_repository";
import {EntityNotFoundException} from "@/server/errors/not_found";
import {CommentRepository} from "@/server/repositories/guide/comment_repository";

export async function DELETE(request: NextRequest,  { params }: { params: { id: string } }) {
  const user = await getUserFromTokenAndRenew(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return CommentRepository.getMessageById(params.id)
    .then((comment) => {
      const user_is_owner_of_the_comment = comment.user__id === user.user__id

      return GuideRepository.getGuideById(comment.guide__id).then((guide) => {
        const user_is_owner_of_the_guide = guide.user__id === user.user__id

        if (!user_is_owner_of_the_guide && !user_is_owner_of_the_comment) {
          return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }

        return CommentRepository.delete(params.id).then(() => {
          return new Response(null, { status: 204 })
        })
      })
    })
    .catch((error: Error) => {
      if (error instanceof EntityNotFoundException) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
      }

      return NextResponse.json({error: error.message}, {status: 500})
    })
}
