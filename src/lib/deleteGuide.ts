import {api} from "@/lib/api";

export async function deleteGuide(guideId: string): Promise<void> {
  return api(`/api/guides/${guideId}`, {
    method: 'DELETE'
  })
}
