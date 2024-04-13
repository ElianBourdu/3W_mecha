import styles from "./page.module.css";
import {getTournamentById} from "@/lib/getTournaments";

export default async function Tournoi({ params }: {params: {id: string}}) {
  const tournoi = await getTournamentById(params.id)

  return (
    <div className={styles.guide_container}>
      <h1>{ tournoi.name }</h1>
      <p>Guide rédigé par { tournoi.user.username }</p>
    </div>
  )
}
