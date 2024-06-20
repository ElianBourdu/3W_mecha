'use client'

import Button from "@/components/button/button";
import {participateTournament} from "@/lib/participateTournament";

export default function Participate({ tournament__id }: { tournament__id: string }) {
  function participate() {
    participateTournament(tournament__id)
      .then(() => document?.location?.reload() )
      .catch(() => {
        alert('Une erreur est survenue merci de réessayer ultérieurement')
      })
  }

  return (
    <Button cta primary onClick={participate}>Participer !</Button>
  )
}