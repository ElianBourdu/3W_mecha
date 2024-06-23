'use client'

import {IUser} from "@/server/entities/iam/user";
import {useEffect, useState} from "react";
import {getLoggedInUser, getUser} from "@/lib/getUser";
import {ITournament} from "@/server/entities/tournament/tournament";
import {getTournamentById, getTournamentResults} from "@/lib/getTournaments";
import {IRound} from "@/server/entities/tournament/round";
import {ask_forfeit, callWinnerInRound, checkin} from "@/lib/checkin";
import Button from "@/components/button/button";
import styles from './page.module.css'
import {useRouter} from "next/navigation";
import WaitingNextMatch from "@/app/tournois/[id]/check-in/waitingNextMatch";

export default function TournamentSteps({ params }: {params: {id: string}}) {
  const router = useRouter()
  const [user, setUser] = useState<IUser>(null)
  const [firstUser, setFirstUser] = useState<IUser>(null)
  const [secondUser, setSecondUser] = useState<IUser>(null)
  const [tournament, setTournament] = useState<ITournament>(null)
  const [round, setRound] = useState<IRound>(null)
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isFiveMinutesPassed, setIsFiveMinutesPassed] = useState<boolean>(false)

  function handleWinner(user) {
    return () => {
      callWinnerInRound(round.tournament__id, round.round__id, user.user__id)
        .then((round) => {
          setRound(round)
        })
    }
  }

  function askForfeit() {
    ask_forfeit(tournament.tournament__id, round.round__id)
      .then(() => {
        location.reload()
      })
  }

  // show forfeit button after delay (currently 5 min)
  useEffect(() => {
    if (!round) return
    const interval = setInterval(() => {
      const isFiveMinutesPassed = round.start_at.getTime() < (new Date(Date.now() - 5 * 60 * 1000)).getTime()
      setIsFiveMinutesPassed(isFiveMinutesPassed)
      if (isFiveMinutesPassed) {
        clearInterval(interval)
      }
    }, 1000)
  }, [isFiveMinutesPassed, round]);

  useEffect(() => {
    getLoggedInUser().then(u => setUser(u))
    getTournamentById(params.id).then(tournament => setTournament(tournament))
    checkin(params.id)
      .then(round => {
        // if there's no round returned, it might be because matchmaking is in progress or odd tournament behavior
        if (!round) return

        setRound(round)
        setIsStarted(!!round.first_player_checkin && !!round.second_player_checkin)

        // fetch the two players in the round
        return Promise.all([
          getUser(round.first_player__id),
          getUser(round.second_player__id)
        ]).then(([firstUser, secondUser]) => {
          setFirstUser(firstUser)
          setSecondUser(secondUser)
        })
      })
      .catch(() => {})
    getTournamentResults(params.id)
      .then(tournamentResult => {
        if (tournamentResult.status === 'done') {
          router.push(`/tournois/${params.id}`)
        }
      })
  }, []);

  if (!round) {
    return <WaitingNextMatch />
  }

  const current_user_is_first_player = round?.first_player__id === user?.user__id
  const result = current_user_is_first_player ? round?.first_player_result : round?.second_player_result

  const askForfeitButton = isFiveMinutesPassed && !result && !isStarted
    ? <Button cta primary onClick={askForfeit}>Ask For Forfeit</Button>
    : <></>

  return (
    <div className={styles.container}>
      <i>tournament: {tournament?.name}</i>
      <i>Stage: {round?.stage}</i>
      {
        firstUser && secondUser &&
        <div className={styles.players}>
          <div className={styles.player}>
            <p className={styles.playerName}>{firstUser.steam_username}</p>
            {
              !isStarted && (round.first_player_checkin
                ? <div>READY</div>
                : <div>en attente</div>)
            }
            {result !== null && isStarted &&
              <div> {(current_user_is_first_player ? result : !result) ? 'WINNER' : 'LOSER'} </div>
            }
            { !current_user_is_first_player && askForfeitButton }
            {isStarted && result === null &&
              <Button cta primary onClick={handleWinner(firstUser)}>WINNER ?</Button>
            }
          </div>
          <div className={styles.player}>
            <p className={styles.playerName}>{secondUser.steam_username}</p>
            {
              !isStarted && (round.second_player_checkin
                ? <div>READY</div>
                : <div>en attente</div>)
            }
            { result !== null && isStarted &&
              <div> {(current_user_is_first_player ? !result : result) ? 'WINNER' : 'LOSER'} </div>
            }
            { current_user_is_first_player && askForfeitButton }
            { isStarted && result === null &&
              <Button cta primary onClick={handleWinner(secondUser)}>WINNER ?</Button>
            }
          </div>
        </div>
      }
    </div>
  )
}
