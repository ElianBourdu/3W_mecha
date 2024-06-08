'use client'

import {useEffect, useState} from "react";
import styles from "./page.module.css";
import Table from "@/components/table/table";
import {getTournamentResults} from "@/lib/getTournaments";

export default function TournamentResults({ params }: {params: {id: string}}) {
  const [tournamentResults, setTournamentResults] = useState<any>()

  useEffect(() => {
    getTournamentResults(params.id).then(tournamentResults => {
      setTournamentResults(tournamentResults)
    })
  }, [])

  return (
    <>
      <div className={styles.tournamentResults}>
        <Table cols={2}>
          <Table.Head>
            <div>Nom</div>
            <div>victoires</div>
          </Table.Head>
          { tournamentResults?.users_victories?.map(user_victories => {
            return (
              <Table.Row className={styles.row} key={user_victories.user.user__id}>
                <p>{user_victories.user.steam_username} </p>
                <p>{user_victories.victories}</p>
              </Table.Row>
            )
          })}
        </Table>
      </div>
    </>
  )
}
