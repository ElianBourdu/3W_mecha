'use server'

import {IGuide} from "@/server/entities/guide/guide";

export async function getGuides(params: any = {}): Promise<IGuide[]> {
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

export async function getGuideByTitle(title: string): Promise<IGuide> {
  return fetch(`http://localhost:3000/api/guides/${title}?includes=user`)
    .then(res => res.json())
    .then(json => json.data)
}
