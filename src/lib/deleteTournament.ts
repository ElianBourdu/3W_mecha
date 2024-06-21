import {api} from "@/lib/api";

export async function delete_tournament(id: string) {
  return api(`/api/tournaments/${id}`, {
    method: 'DELETE',
  })
}
