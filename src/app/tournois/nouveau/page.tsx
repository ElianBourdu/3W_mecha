'use client'

import React, {useState} from "react";
import {useRouter} from 'next/navigation'
import styles from './page.module.css'
import {createTournament} from "@/lib/createTournament";
import {convertToDateTimeLocalString} from "@/lib/date";

// Pour calculer la durée moyenne d'un tournoi, une manche dure 20 minutes en moyenne
const ROUND_AVERAGE_DURATION = 1000 * 60 * 20

export default function CreateGuide() {
  const [name, setName] = useState<string>('')
  const [max_players, setMaxPlayers] = useState<number>(16)
  // par défaut on crée un tournoi dans une semaine
  const [start_at, setStartAt] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

  const router = useRouter()

  // gère la soumission du formulaire, la création du tournoi et la redirection vers la page du tournoi
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    createTournament({ name, max_players, start_at })
      .then((response) => {
        setTimeout(() => {
          router.push('/tournois/' + response.tournament__id)
        }, 2000)
      })
      .catch((error) => {
        // TODO: handle error
      })
  }

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <input
          className={styles.title_input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"Nom du tournoi"}
          maxLength={255}
          name="name"
        />
        <input
          className={styles.title_input}
          type="number"
          value={max_players}
          onChange={(e) => setMaxPlayers(+e.target.value)}
          placeholder="Nombre de joueurs maximum"
          max={64}
          min={2}
          name="max_players"
        />
        <input
          className={styles.title_input}
          type="datetime-local"
          value={convertToDateTimeLocalString(start_at)}
          onChange={(e) => setStartAt(new Date(e.target.value))}
          placeholder="Nombre de joueurs maximum"
          max={convertToDateTimeLocalString(new Date(Date.now() + 1000 * 60 * 60 * 24 * 31))}
          min={convertToDateTimeLocalString(new Date(Date.now() + 1000 * 60 * 5))}
          name="start_at"
        />
        <i>
          le tournoi commencera le {start_at.toLocaleDateString()} à {start_at.toLocaleTimeString()}
        </i>
        <i>
          Il durera environ {Math.ceil(max_players / 2) * ROUND_AVERAGE_DURATION} minutes si la capacité maximale est
          atteinte
        </i>
        <button type="submit" className={styles.submit_button}>
          Créer le tournoi
        </button>
      </form>
    </>
  )
}
