import {IComment} from "@/server/entities/guide/comment";
import {api} from "@/lib/api";

export async function getCommentsOfGuide(guide_title: string): Promise<IComment[]> {
  return api<IComment[]>('/api/guides/' + guide_title + '/comments')
}

export async function createComment(guide_title: string, content: string): Promise<IComment> {
  return api<IComment>('/api/guides/' + guide_title + '/comments', {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

export async function deleteComment(comment__id: string): Promise<void> {
  return api<void>('/api/comments/' + comment__id, {
    method: 'DELETE'
  })
}
