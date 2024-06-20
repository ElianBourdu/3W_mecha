'use client'

import {useEffect, useState} from "react";
import styles from "./page.module.css";
import {getTournaments} from "@/lib/getTournaments";
import Tournament from "@/app/tournois/tournament";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import {getLoggedInUser} from "@/lib/getUser";
import {IUser} from "@/server/entities/iam/user";
import {ITournament} from "@/server/entities/tournament/tournament";
import Table from "@/components/table/table";

export default function Guides() {
  const [tournaments, setTournaments] = useState<ITournament[]>([])
  const [getClosed, setGetClosed] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>(null)
  const handleChange = (inputValue: string) => {
    getTournaments({  }).then(tournaments => setTournaments(tournaments))
  }

  useEffect(() => {
    getLoggedInUser().then(user => setUser(user))
    getTournaments({
      ...(getClosed ? { includeClosed: true } : {})
    }).then(tournaments => setTournaments(tournaments))
  }, [])

  return (
    <>
      <div className={styles.tournaments}>
        <div className={styles.searchBar}>
          <Input placeholder="Rechercher un tournoi !" onChange={handleChange} />
          { !!user &&
            <Button cta href="/tournois/nouveau">Créer un tournoi</Button>
          }
        </div>
          <Table cols={5}>
          <Table.Head>
            <div>Nom</div>
            <div>Places</div>
            <div>Organisateur</div>
            <div>date</div>
            <div></div>
          </Table.Head>
          { tournaments.map(tournament => {
            return (
              <Table.Row className={styles.row}>
                <p>{tournament.name}</p>
                <p> {tournament.player_count} / {tournament.max_players} </p>
                <p>créé par {tournament.user.username}</p>
                <p> {tournament.start_at.toLocaleString()} </p>
                <div className={styles.button}>
                  <Button href={`/tournois/${encodeURI(tournament.tournament__id)}`}>
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
