import Countdown from "@/components/countdown/countdown";
import Button from "@/components/button/button";
import Participate from "@/app/tournois/[id]/participate";

export function RunningAndPrerunningTournamentHeader({ tournament, alreadyStarted, user, alreadyParticipate }) {
  return (
    <>
      <Countdown closingDate={tournament.start_at}/>
      <p>Tournoi organisé par { tournament.user.username }</p>
      { alreadyStarted &&
        <Button cta href={`/tournois/${encodeURI(tournament.tournament__id)}/check-in`}>
          Check-in !
        </Button>
      }
        { !!user && !alreadyParticipate && !alreadyStarted &&
        <Participate tournament__id={tournament.tournament__id} />
      }
      { alreadyStarted
        ? <p>Le tournoi a commencé !</p>
        : <p>Le tournoi commence le {tournament.start_at.toLocaleDateString()} à {tournament.start_at.toLocaleTimeString()}</p>
      }
    </>
  )
}