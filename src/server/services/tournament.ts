import {TournamentRepository} from "@/server/repositories/tournament/tournament_repository";
import {RoundRepository} from "@/server/repositories/tournament/round_repository";
import {Round} from "@/server/entities/tournament/round";
import {User} from "@/server/entities/iam/user";
import {InvalidRound} from "@/server/errors/invalid_round";
import {StageNotFinished} from "@/server/errors/stage_not_finished";
import {NotEnoughPlayers} from "@/server/errors/not_enough_players";
import {AlreadyGeneratingMatch} from "@/server/errors/already_generating_match";
import {TournamentAlreadyWon} from "@/server/errors/tournament_already_won";

type TournamentHistory = {
  victories?: Round[]
  defeats?: Round[]
}

export class MatchMaker {

  private static currentGenerations: string[] = []

  private static isGenerating(tournament__id: string): boolean {
    return MatchMaker.currentGenerations.includes(tournament__id)
  }

  public static async newGeneration(tournament__id: string): Promise<Round[]> {
    if (this.isGenerating(tournament__id)) {
      throw new AlreadyGeneratingMatch()
    }

    this.currentGenerations.push(tournament__id)

    return this.generate(tournament__id)
      .finally(() => {
        const index = this.currentGenerations.indexOf(tournament__id)
        if (index !== -1) {
          delete this.currentGenerations[index]
        }
      })
  }

  private static async generate(tournamentId: string): Promise<Round[]> {
    // on récupère les joueurs du tournoi
    const players: (User & TournamentHistory)[] = await TournamentRepository.getTournamentPlayers(tournamentId)

    // si il n'y a pas assez de joueurs, annulé
    if (players.length < 2) {
      throw new NotEnoughPlayers()
    }

    // on récupère le nombre de victoire de chaque joueur durant le tournoi,
    // triées du plus grand nombre de victoires au plus petit
    const playersVictories = await TournamentRepository.getSortedUsersVictories(tournamentId)

    // si un joueur possède plus de victoire que tout les autres, alors il est considéré comme gagnant
    if (playersVictories[0].victories > playersVictories[1].victories) {
      throw new TournamentAlreadyWon()
    }

    // on récupère les rounds du tournoi
    const rounds = await RoundRepository.getTournamentRounds(tournamentId)
    // on récupère le stage actuel
    const stage = rounds.reduce((acc, round) => Math.max(acc, round.stage), 0)
    // on vérifie que le stage est fini
    const isStageFinished = rounds.reduce((acc, round) => {
      return acc && round.first_player_result !== null && round.second_player_result !== null
    }, true)

    // TODO: handle AFK players

    // si le stage actuel n'est pas fini, remonté une erreur, on ne peut pas créer de nouveaux matchs
    if (!isStageFinished) {
      throw new StageNotFinished(stage, 'The stage is not finished yet')
    }

    // assigne les victoires et défaites de chaque joueur pour faciliter le code par la suite
    players.forEach(player => {
      player.victories = rounds.filter(round => {
        // si les deux joueurs ont donner le même résultats, on remonte une erreur
        if (round.first_player_result === round.second_player_result && round.first_player_result !== null) {
          throw new InvalidRound(round, 'Players gave the same result, round is invalid')
        }
        return round.first_player_result && round.first_player__id === player.user__id
          || round.second_player_result && round.second_player__id === player.user__id
      })
      player.defeats = rounds.filter(round => {
        // si les deux joueurs ont donner le même résultats, on remonte une erreur
        if (round.first_player_result === round.second_player_result && round.first_player_result !== null) {
          throw new InvalidRound(round, 'Players gave the same result, round is invalid')
        }
        return !round.first_player_result && round.first_player__id === player.user__id
          || !round.second_player_result && round.second_player__id === player.user__id
      })
      // si un joueur n'a pas jouer un stage, c'est qu'il a été écarter par le match make, nous lui donner un bye
      if (player.victories.length + player.defeats.length !== stage) {
        player.victories.push(new Round())
      }
    })

    // trié les joueurs en fonction de leur victoires et de leur rang, d'abord ceux qui ont
    // le plus de victoires puis par rang
    players.sort((a, b) => {
      if (a.victories.length > b.victories.length) {
        return -1
      } else if (a.victories.length < b.victories.length) {
        return 1
      } else {
        return a.rating ?? 1500 - b.rating ?? 1500
      }
    })

    // si il y a un nombre impaire de joueur
    if (players.length % 2 !== 0) {
      // on selectionne un joueur au hasard pour lui donner un bye
      players.pop()
    }

    // on crée les matchs
    const matches: Round[] = []
    for (let i = 0; i < players.length - 1; i += 2) {
      const round = new Round()
      round.tournament__id = tournamentId
      round.stage = stage + 1
      round.first_player__id = players[i].user__id
      round.second_player__id = players[i + 1].user__id
      matches.push(round)
    }

    return matches
  }
}
