'use server'

import {IUser} from "@/server/entities/iam/user";
import {cookies} from "next/headers";

export async function getLoggedInUser(): Promise<IUser> {
  const cookieStore = cookies()
  const mechaToken = cookieStore.get('mechaToken')
  if (!mechaToken) {
    return null
  }
  return JSON.parse(atob(mechaToken.value.split('.')[1]))
}

export async function getUser(user__id: string): Promise<IUser> {
  return fetch(`http://localhost:3000/api/users/${user__id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get user ' + user__id)
      }
      return res.json()
    })
    .then(json => json.data)
}
