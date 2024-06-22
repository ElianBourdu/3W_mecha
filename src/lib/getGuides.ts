'use server'

import {IGuide} from "@/server/entities/guide/guide";
import {api} from "@/lib/api";

export async function getGuides(params: any = {}): Promise<IGuide[]> {
  const urlParams = {
    includes: 'user',
    ...params
  }
  const stringParams = new URLSearchParams(urlParams).toString()
  return api<IGuide[]>(`/api/guides?${stringParams}`)
}

export async function getGuideByTitle(title: string): Promise<IGuide> {
  return api<IGuide>(`/api/guides/${title}?includes=user`)
}
