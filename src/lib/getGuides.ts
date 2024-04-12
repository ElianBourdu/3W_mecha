'use server'

import {IGuide} from "@/server/entities/guide/guide";
import {IUser} from "@/server/entities/iam/user";

type GuideWithUser = IGuide & { user: IUser }

export async function getGuides(params: any = {}): Promise<GuideWithUser[]> {
  'use server'
  const urlParams = {
    includes: 'user',
    ...params
  }
  const stringParams = new URLSearchParams(urlParams).toString()
  return fetch(`http://localhost:3000/api/guides?${stringParams}`)
    .then(res => res.json())
    .then(json => json.data)
}
