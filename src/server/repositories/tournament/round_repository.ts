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

  public static async isStageFinished(tournamentId: string): Promise<boolean> {
    return getPool().query<{ count_finished: number, count_all: number }>(
      `
        SELECT (
           SELECT count(*)
           FROM tournament.round
           WHERE tournament__id = $1
             AND first_player_result IS NOT NULL
             AND second_player_result IS NOT NULL
        ) as count_finished, (
           SELECT count(*)
           FROM tournament.round
           WHERE tournament__id = $1
        ) as count_all
      `,
      [tournamentId]
    ).then((res) => {
      return res.rows[0].count_finished === res.rows[0].count_all
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

  public static async deleteAllRounds(tournament__id: string): Promise<void> {
    return getPool().query<IRound>(
      `
        DELETE FROM tournament.round
        WHERE tournament__id = $1
      `,
      [tournament__id]
    ).then(() => {})
  }

  public static async getCurrentRound(tournamentId: string, playerId: string, includeCheckedinRound: boolean): Promise<Round> {
    return getPool().query<IRound>(
      `
        SELECT round__id, tournament__id, stage, start_at, first_player__id, first_player_checkin, first_player_result, second_player__id, second_player_checkin, second_player_result
        FROM tournament.round
        WHERE
            tournament__id = $1
          AND (first_player__id = $2 OR second_player__id = $2)
          ${includeCheckedinRound ? '' : 'AND (first_player_checkin IS NULL OR second_player_checkin IS NULL)'}
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

  public static async updateCheckinPlayer(tournament__id: string, user__id: string): Promise<Round> {
    return getPool().query<IRound>(
      `
      UPDATE tournament.round
      SET first_player_checkin = 
          CASE WHEN round.first_player__id = $1 AND round.first_player_checkin IS NULL
              THEN current_timestamp
          ELSE first_player_checkin END,
          second_player_checkin =
          CASE WHEN round.second_player__id = $1 AND round.second_player_checkin IS NULL
              THEN current_timestamp 
          ELSE second_player_checkin END
      WHERE (first_player__id = $1 OR second_player__id = $1)
        AND tournament__id = $2
        AND stage = (SELECT MAX(stage) FROM tournament.round WHERE tournament__id = $2)
      RETURNING *
      `,[user__id, tournament__id]
    ).then((res) => {
      if (res.rowCount === 0) {
        throw new EntityNotFoundException('Round', {first_layer__id: user__id, second_player__id: user__id})
      }

      return Round.fromObject(res.rows[0])
    })
  }

  public static async registerPlayerResult(round__id: string, user__id: string, is_user_winning: boolean): Promise<Round> {
    return getPool().query(`
      UPDATE tournament.round
      SET first_player_result =
          CASE WHEN round.first_player__id = $1 AND round.first_player_result IS NULL
            THEN $2
            ELSE first_player_result END,
            second_player_result =
          CASE WHEN round.second_player__id = $1 AND round.second_player_result IS NULL
            THEN $2
            ELSE second_player_result END
      WHERE round__id = $3
      RETURNING *
    `, [user__id, is_user_winning, round__id])
      .then(res => {
        if (res.rowCount === 0) {
          throw new EntityNotFoundException('Round', {round__id})
        }

        return Round.fromObject(res.rows[0])
      })
  }

}
