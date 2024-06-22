'use server'

import {IUser} from "@/server/entities/iam/user";
import {cookies} from "next/headers";
import {api} from "@/lib/api";

export async function getLoggedInUser(): Promise<IUser> {
  const cookieStore = cookies()
  const mechaToken = cookieStore.get('mechaToken')
  if (!mechaToken) {
    return null
  }
  return JSON.parse(atob(mechaToken.value.split('.')[1]))
}

export async function getUser(user__id: string): Promise<IUser> {
  return api<IUser>(`/api/users/${user__id}`)
}
