'use server'

import {IUser} from "@/server/entities/iam/user";
import {cookies} from "next/headers";

export async function getUser(): Promise<IUser> {
  const cookieStore = cookies()
  const mechaToken = cookieStore.get('mechaToken')
  if (!mechaToken) {
    return null
  }
  return JSON.parse(atob(mechaToken.value.split('.')[1]))
}