import styles from "./tournament.module.css";
import {TournamentWithUser} from "@/lib/getTournaments";

export default function Tournament({ tournament }: {tournament: TournamentWithUser}) {
  return (
    <a href={`/tournois/${encodeURI(tournament.tournament__id)}`} className={styles.tournament}>
      <h2 className={styles.title}>{ tournament.name }</h2>
      <p className={styles.wrote_by}>Tournoi créé { tournament.user.username }</p>
    </a>
  )
}
