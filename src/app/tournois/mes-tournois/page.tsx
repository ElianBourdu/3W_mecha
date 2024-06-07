'use client'

import {useEffect, useState} from "react";
import styles from "./page.module.css";
import {getMyTournaments, getTournaments} from "@/lib/getTournaments";
import Button from "@/components/button/button";
import {getLoggedInUser} from "@/lib/getUser";
import {IUser} from "@/server/entities/iam/user";
import {ITournament} from "@/server/entities/tournament/tournament";
import Table from "@/components/table/table";

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState<ITournament[]>([])
  const [user, setUser] = useState<IUser>(null)

  useEffect(() => {
    getLoggedInUser().then(user => setUser(user))
    getMyTournaments().then(tournaments => {
      setTournaments(tournaments)
    })
  }, [])

  return (
    <>
      <div className={styles.tournaments}>
        <div className={styles.searchBar}>
          { !!user &&
            <Button cta href="/tournois/nouveau">Créer un tournoi</Button>
          }
        </div>
        <Table cols={4}>
          <Table.Head>
            <div>Nom</div>
            <div>Organisateur</div>
            <div>date</div>
            <div></div>
          </Table.Head>
          { tournaments.map(tournament => {
            return (
              <Table.Row className={styles.row} key={tournament.tournament__id}>
                <p>{tournament.name}</p>
                <p>créé par {tournament.user.username}</p>
                <p> {tournament.start_at.toLocaleString()} </p>
                <div className={styles.button}>
                  <Button cta href={`/tournois/${encodeURI(tournament.tournament__id)}`}>
                    Voir plus
                  </Button>
                </div>
              </Table.Row>
            )
          })}
        </Table>
      </div>
    </>
  )
}
