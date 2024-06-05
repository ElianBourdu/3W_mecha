'use client'

import Button from "@/components/button/button";
import {participateTournament} from "@/lib/participateTournament";

export default async function Participate({ tournament__id }: { tournament__id: string }) {
  function participate() {
    participateTournament(tournament__id)
  }

  return (
    <Button cta primary onClick={participate}>Participer !</Button>
  )
}