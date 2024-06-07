import styles from "./page.module.css";
import {getTournamentById, getTournamentPlayers} from "@/lib/getTournaments";
import H1 from "@/components/titles/h1";
import {getLoggedInUser} from "@/lib/getUser";
import Table from "@/components/table/table";
import dynamic from 'next/dynamic'
import Participate from "@/app/tournois/[id]/participate";
import Button from "@/components/button/button";

const Countdown = dynamic(() => import('@/components/countdown/countdown'), { ssr: false })

export default async function Tournoi({ params }: {params: {id: string}}) {
  const tournament = await getTournamentById(params.id)
  const players = (await getTournamentPlayers(params.id)).sort((a, b) => b.rating - a.rating)
  const user = await getLoggedInUser()
  const alreadyStarted = new Date() > tournament.start_at
  const alreadyParticipate = players.map(p => p.user__id).includes(user?.user__id)

  return (
    <div className={styles.tournament_container}>
      <H1>{ tournament.name }</H1>
      <Countdown closingDate={tournament.start_at}/>
      <p>Tournoi organisé par { tournament.user.username }</p>
      { alreadyStarted
        ? <p>Le tournoi a commencé !</p>
        : <p>Le tournoi commence le {tournament.start_at.toLocaleDateString()} à {tournament.start_at.toLocaleTimeString()}</p>
      }
      { alreadyStarted &&
        <Button cta href={`/tournois/${encodeURI(tournament.tournament__id)}/check-in`}>
          Check-in !
        </Button>
      }
      { !!user && !alreadyParticipate &&
        <Participate tournament__id={params.id} />
      }
      <Table cols={2}>
        <Table.Head>
          <div>Participants: {players.length}/{tournament.max_players}</div>
          <div>MMR</div>
        </Table.Head>
        {players.map((user, index) => (
          <Table.Row key={user.user__id}>
            <div>{user.username}</div>
            <div>{user.rating ?? 'non classé'}</div>
          </Table.Row>
        ))}
      </Table>
    </div>
  )
}
