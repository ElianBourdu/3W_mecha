'use server'

import {IGuide} from "@/server/entities/guide/guide";
import {IUser} from "@/server/entities/iam/user";

export type GuideWithUser = IGuide & { user: IUser }

export async function getGuides(params: any = {}): Promise<GuideWithUser[]> {
  const urlParams = {
    includes: 'user',
    ...params
  }
  const stringParams = new URLSearchParams(urlParams).toString()
  return fetch(`http://localhost:3000/api/guides?${stringParams}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get guides')
      }
      return res.json()
    })
    .then(json => json.data)
}

export async function getGuideByTitle(title: string): Promise<IGuide & { user: IUser }> {
  return fetch(`http://localhost:3000/api/guides/${title}?includes=user`)
    .then(res => res.json())
    .then(json => json.data)
}
