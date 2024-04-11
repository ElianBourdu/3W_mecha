import { cookies} from "next/headers";
import {atob} from "node:buffer";

export function getUser(): {username: string, user__id: string, steam_username: string} {
  const cookieStore = cookies()
  const mechaToken = cookieStore.get('mechaToken')
  if (!mechaToken) {
    return null
  }
  return JSON.parse(atob(mechaToken.value.split('.')[1]))
}