import {Round} from "@/server/entities/tournament/round";

export function getRoundsByStages(rounds: Round[]) {
  return rounds.reduce((acc, round) => {
    acc[round.stage] = (acc[round.stage] ?? [])
    acc[round.stage].push(round)
    return acc
  }, {} as Record<number, Round[]>)
}

export function getPlayersVictoriesAndDefeats(rounds: Round[]) {
  const VictoriesByPlayer = rounds.reduce((acc, round) => {
    // creation des joueurs si ils n'existent pas dans l'accumulateur
    if (!acc[round.first_player__id]) {
      acc[round.first_player__id] = { victories: 0, defeats: 0 }
    }
    if (!acc[round.second_player__id]) {
      acc[round.second_player__id] = { victories: 0, defeats: 0 }
    }

    // ajout des victoires et défaites
    if (round.first_player_result === true && round.second_player_result === false) {
      acc[round.first_player__id].victories += 1
      acc[round.second_player__id].defeats += 1
    }
    if (round.second_player_result === true && round.first_player_result === false) {
      acc[round.second_player__id].victories += 1
      acc[round.first_player__id].defeats += 1
    }

    return acc
  }, {} as Record<string, { victories: number, defeats: number }>)

  return Object.entries(VictoriesByPlayer)
    .map(([user__id, { victories, defeats }]) =>
      ({ user__id, victories, defeats }))
    .sort((a, b) => b.victories - a.victories)
}
