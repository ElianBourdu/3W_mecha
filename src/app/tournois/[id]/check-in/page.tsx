'use client'

import {IUser} from "@/server/entities/iam/user";
import {useEffect, useState} from "react";
import {getLoggedInUser, getUser} from "@/lib/getUser";
import {ITournament} from "@/server/entities/tournament/tournament";
import {getTournamentById} from "@/lib/getTournaments";
import {IRound} from "@/server/entities/tournament/round";
import {callWinnerInRound, checkin} from "@/lib/checkin";
import Button from "@/components/button/button";
import styles from './page.module.css'

export default function TournamentSteps({ params }: {params: {id: string}}) {
  const [user, setUser] = useState<IUser>(null)
  const [firstUser, setFirstUser] = useState<IUser>(null)
  const [secondUser, setSecondUser] = useState<IUser>(null)
  const [tournament, setTournament] = useState<ITournament>(null)
  const [round, setRound] = useState<IRound>(null)
  const [isStarted, setIsStarted] = useState<boolean>(false)

  function handleWinner(user) {
    return () => {
      callWinnerInRound(round.tournament__id, round.round__id, user.user__id)
        .then((round) => {
          setRound(round)
        })
    }
  }

  useEffect(() => {
    getLoggedInUser().then(u => setUser(u))
    getTournamentById(params.id).then(tournament => setTournament(tournament))
    checkin(params.id)
      .then(round => {
        setRound(round)
        setIsStarted(!!round.first_player_checkin && !!round.second_player_checkin)
        return round
      })
      // fetch the two players in the round
      .then((round) => {
        return Promise.all([
          getUser(round.first_player__id),
          getUser(round.second_player__id)
        ])
      })
      .then(([firstUser, secondUser]) => {
        setFirstUser(firstUser)
        setSecondUser(secondUser)
      })
  }, []);

  const current_user_is_first_player = round?.first_player__id === user?.user__id
  const result = current_user_is_first_player ? round?.first_player_result : round?.second_player_result

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
            { isStarted && result === null &&
              <Button cta primary onClick={handleWinner(secondUser)}>WINNER ?</Button>
            }
          </div>
        </div>
      }
    </div>
  )
}
