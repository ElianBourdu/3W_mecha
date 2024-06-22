import {api} from "@/lib/api";
import {IGuide} from "@/server/entities/guide/guide";

export async function createGuide(title: string, content: string) {
  return api<IGuide>('/api/guides', {
    body: JSON.stringify({ title, content }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
