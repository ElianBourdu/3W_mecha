import { getPool } from "@/server/db";
import {IRound, Round} from "@/server/entities/tournament/round";
import {EntityNotFoundException} from "@/server/errors/not_found";

export class RoundRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  public static async createRound(round: Round): Promise<Round> {
    return getPool().query(
      `
        INSERT INTO tournament.round (tournament__id, stage, start_at, first_player__id, second_player__id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
      [round.tournament__id, round.stage, new Date(), round.first_player__id, round.second_player__id]
    ).then(res => {
      if (res.rowCount !== 1) {
        throw new Error('Error while creating round')
      }
      return Round.fromObject(res.rows[0])
    })
  }

  public static async getTournamentRounds(tournamentId: string): Promise<Round[]> {
    return getPool().query<IRound>(
      `
        SELECT round__id, tournament__id, stage, start_at, first_player__id, first_player_checkin, first_player_result, second_player__id, second_player_checkin, second_player_result
        FROM tournament.round
        WHERE tournament__id = $1
        ORDER BY stage
      `,
      [tournamentId]
    ).then((res) => {
      return res.rows.map((row) => Round.fromObject(row))
    })
  }

  public static async getCurrentRound(tournamentId: string, playerId: string): Promise<Round> {
    return getPool().query<IRound>(
      `
        SELECT round__id, tournament__id, stage, start_at, first_player__id, first_player_checkin, first_player_result, second_player__id, second_player_checkin, second_player_result
        FROM tournament.round
        WHERE
            tournament__id = $1
          AND (first_player__id = $2 OR second_player__id = $2)
          AND (first_player_checkin = FALSE OR second_player_checkin = FALSE)
        ORDER BY stage DESC
        LIMIT 1
      `,
      [tournamentId, playerId]
    ).then((res) => {
      if (res.rowCount === 0) {
        throw new EntityNotFoundException('Round', { tournamentId, playerId })
      }

      return Round.fromObject(res.rows[0])
    })
  }
}
