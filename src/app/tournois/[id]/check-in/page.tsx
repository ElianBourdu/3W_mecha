'use client'

import {useRouter} from "next/navigation";
import {IUser} from "@/server/entities/iam/user";
import {useEffect, useState} from "react";
import {getUser} from "@/lib/getUser";
import {ITournament} from "@/server/entities/tournament/tournament";
import {getTournamentById} from "@/lib/getTournaments";
import {IRound} from "@/server/entities/tournament/round";

export default function TournamentSteps({ params }: {params: {id: string}}) {
  const router = useRouter()
  const [user, setUser] = useState<IUser>(null)
  const [tournament, setTournament] = useState<ITournament>(null)
  const [round, setRound] = useState<IRound>(null)

  useEffect(() => {
    getUser().then(u => setUser(u))
    getTournamentById(params.id).then(tournament => setTournament(tournament))
    getRound
  }, []);

  return (
    <>
      {tournament?.tournament__id}
    </>
  )
}
