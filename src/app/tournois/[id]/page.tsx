'use client'

import styles from "./page.module.css";
import {getTournamentById, getTournamentPlayers, getTournamentResults} from "@/lib/getTournaments";
import H1 from "@/components/titles/h1";
import {getLoggedInUser} from "@/lib/getUser";
import Table from "@/components/table/table";
import {useEffect, useState} from "react";
import {ITournament} from "@/server/entities/tournament/tournament";
import {IUser} from "@/server/entities/iam/user";
import {IRound} from "@/server/entities/tournament/round";
import {RunningAndPrerunningTournamentHeader} from "@/app/tournois/[id]/RunningAndPrerunningTournamentHeader";
import {delete_tournament} from "@/lib/deleteTournament";
import Button from "@/components/button/button";
import {useRouter} from "next/navigation";

export default function Tournoi({ params }: {params: {id: string}}) {
  const router = useRouter()
  const [tournament, setTournament] = useState<ITournament>()
  const [players, setPlayers] = useState<IUser[]>([])
  const [user, setUser] = useState<IUser>()
  const [alreadyStarted, setAlreadyStarted] = useState<Boolean>(false)
  const [alreadyParticipate, setAlreadyParticipate] = useState<Boolean>()
  const [tournamentResult, setTournamentResult] = useState<{
    status: 'done' | 'running',
    stages: Record<number, IRound[]>,
    users_victories: { victories: number, user: IUser }[]
  }>()

  useEffect(() => {
    getTournamentById(params.id)
      .then(tournament => {
        setTournament(tournament)
        setAlreadyStarted(new Date() > tournament.start_at)
      })
    getLoggedInUser()
      .then(user => setUser(user))
    getTournamentResults(params.id)
      .then(tournamentResult => {
        setTournamentResult(tournamentResult)
      })
  }, []);

  useEffect(() => {
    getTournamentPlayers(params.id)
      .then(players => {
        players.sort((a, b) => b.rating - a.rating)
        setPlayers(players)
        setAlreadyParticipate(players.map(p => p.user__id).includes(user?.user__id))
      })
  }, [user]);

  function deleteTournament() {
    delete_tournament(params.id)
      .then(() => {
        router.push('/tournois')
      })
  }

  if (!tournament || !tournamentResult) return (<></>)

  const deleteButton = tournament.owner__id === user?.user__id
    ? <Button tertiary onClick={deleteTournament}>Supprimer le tournoi</Button>
    : <></>

  const header = tournamentResult.status === 'running'
    ? <RunningAndPrerunningTournamentHeader
      tournament={tournament}
      alreadyStarted={alreadyStarted}
      canParticipate={!!user && !alreadyParticipate && !alreadyStarted && players.length < tournament.max_players}
    />
    : <></>

  const table = tournamentResult.status === 'running'
    ? <Table cols={2}>
      <Table.Head>
        <div>Participants: {players.length}/{tournament.max_players}</div>
        <div>MMR</div>
        {

        }
      </Table.Head>
      {players.map((user, index) => (
        <Table.Row key={user.user__id}>
          <div>{user.username}</div>
          <div>{user.rating ?? 'non classé'}</div>
        </Table.Row>
      ))}
    </Table>
    : <Table cols={2}>
      <Table.Head>
        <div>Nom</div>
        <div>victoires</div>
      </Table.Head>
      { tournamentResult?.users_victories?.map(user_victories => {
        return (
          <Table.Row className={styles.row} key={user_victories.user.user__id}>
            <p>{user_victories.user.steam_username} </p>
            <p>{user_victories.victories}</p>
          </Table.Row>
        )
      })}
    </Table>

  return (
    <div className={styles.tournament_container}>
      <H1>{ tournament.name }</H1>
      { header }
      { table }
      <div className={styles.delete_section}>
        { deleteButton }
      </div>
    </div>
  )
}
