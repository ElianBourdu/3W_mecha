import styles from "./tournament.module.css";
import Button from "@/components/button/button";
import {ITournament} from "@/server/entities/tournament/tournament";

export default function Tournament({ tournament }: {tournament: ITournament}) {
  return (
    <>
      {/*<Button style={{ width: '100%' }} href={`/tournois/${encodeURI(tournament.tournament__id)}`} tertiary >*/}
      {/*  <div className={styles.tournament}>*/}

        {/*</div>*/}
      {/*</Button>*/}
    </>
  )
}
