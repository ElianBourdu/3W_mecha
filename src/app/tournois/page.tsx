'use client'

import SearchBar from "@/components/searchBar";
import {useEffect, useState} from "react";
import styles from "./page.module.css";
import {getTournaments, TournamentWithUser} from "@/lib/getTournaments";
import Tournament from "@/app/tournois/tournament";

export default function Guides() {
  const [tournaments, setTournaments] = useState<TournamentWithUser[]>([])
  const [getClosed, setGetClosed] = useState<boolean>(false)
  const handleChange = (inputValue: string) => {
    getTournaments({  }).then(tournaments => setTournaments(tournaments))
  }

  useEffect(() => {
    getTournaments({
      ...(getClosed ? { includeClosed: true } : {})
    }).then(tournaments => setTournaments(tournaments))
  }, [getClosed])

  return (
    <>
      <div className={styles.searchBar}>
        <SearchBar placeholder="Rechercher un tournoi !" onChange={handleChange} />
      </div>
      <div className={styles.tournaments}>
        { tournaments.map(tournament => {
          return (
            <Tournament tournament={tournament} key={tournament.tournament__id}/>
          )
        })}
      </div>
    </>
  )
}
