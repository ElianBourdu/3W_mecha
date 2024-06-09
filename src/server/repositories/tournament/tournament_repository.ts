import { getPool } from "@/server/db";
import { EntityNotFoundException } from "@/server/errors/not_found";
import {ITournament, Tournament} from "@/server/entities/tournament/tournament";
import {IUser} from "@/server/entities/iam/user";
import {User} from "@/server/entities/iam/user";
import {EntityAlreadyExists} from "@/server/errors/entity_already_exists";

type UserVictoriesCount = { victories: number, user: User }

export class TournamentRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  /**
   * retourne un tournoi par son ID
   *
   * @param string tournamentId
   */
  public static async getTournamentById(tournamentId: string): Promise<Tournament> {
    return getPool().query<ITournament & IUser>(
      `
        SELECT tournament__id, owner__id, max_players, name, start_at, user__id, username, steam_username, rating, password
        FROM tournament.tournament
            JOIN iam."user" u ON tournament.owner__id = u.user__id
        WHERE tournament__id = $1
      `,
      [tournamentId])
      .then((res) => {
        if (res.rows.length === 0) {
          throw new EntityNotFoundException('Tournament', {id: tournamentId})
        }

        const tournament = Tournament.fromObject(res.rows[0])
        const user = User.fromObject(res.rows[0])
        tournament.user = user
        return tournament
      })
  }

  public static async getTournamentPlayerCount(tournamentId: string): Promise<number> {
    return getPool().query<{ count: number }>(
      `
        SELECT count(*) as count
        FROM tournament.user__tournament tournament_player
            JOIN iam."user" u ON tournament_player.user__id = u.user__id
        WHERE tournament__id = $1
      `,
      [tournamentId]
    ).then((res) => {
      return res.rows[0].count
    })
  }

  public static async getTournamentPlayers(tournamentId: string): Promise<User[]> {
    return getPool().query<IUser>(
      `
        SELECT tournament_player.user__id, username, steam_username, rating
        FROM tournament.user__tournament tournament_player
            JOIN iam."user" u ON tournament_player.user__id = u.user__id
        WHERE tournament__id = $1
      `,
      [tournamentId]
    ).then((res) => {
      return res.rows.map((row) => User.fromObject(row))
    })
  }

  /**
   * retourne tous les tournois
   */
  public static async getAllTournaments(
    limit = 10,
    offset = 0,
    includeClosed = false
  ): Promise<Tournament[]> {
    return getPool().query<ITournament & IUser & { player_count: number }>(
      `
          SELECT t.tournament__id,
                 owner__id,
                 max_players,
                 name,
                 start_at,
                 u.user__id,
                 username,
                 steam_username,
                 rating,
                 count(tp.user__id) as player_count
          FROM tournament.tournament t
                   JOIN iam."user" u ON t.owner__id = u.user__id
                   LEFT JOIN tournament.user__tournament tp ON tp.tournament__id = t.tournament__id
          ${!includeClosed ? 'WHERE start_at > NOW()' : ''}
          GROUP BY t.tournament__id,
                   owner__id,
                   max_players,
                   name,
                   start_at,
                   u.user__id,
                   username,
                   steam_username,
                   rating
          ORDER BY start_at DESC
          LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    ).then((res) => {
      return res.rows.map((row) => {
        const tournament = Tournament.fromObject(row)
        const user = User.fromObject(row)
        tournament.user = user
        tournament.player_count = row.player_count
        return tournament
      })
    })
  }

  public static async makeParticipate(tournamentId: string, userId: string): Promise<void> {
    return getPool().query(
      `
        INSERT INTO tournament.user__tournament (tournament__id, user__id)
        VALUES ($1, $2)
      `,
      [tournamentId, userId]
    ).then((res) => {
      if (res.rowCount !== 1) {
        throw new EntityAlreadyExists()
      }
    })
  }

  /**
   * Crée un tournoi
   *
   * @param Omit<ITournament, 'tournament__id'> tournament
   */
  public static async createTournament(tournament: Omit<ITournament, 'tournament__id'>): Promise<Tournament> {
    return getPool().query<ITournament & IUser>(
      `
          INSERT INTO tournament.tournament (owner__id, name, start_at, max_players)
          VALUES ($1, $2, $3, $4)
          RETURNING tournament__id, owner__id, name, start_at, max_players
      `,
      [tournament.owner__id, tournament.name, tournament.start_at, tournament.max_players]
    ).then((res) => {
      return Tournament.fromObject(res.rows[0])
    })
  }

  public static async getTournamentJoinedByPlayer(user__id: string): Promise<Tournament[]> {
    return getPool().query<ITournament & IUser>(
      `
        SELECT t.tournament__id, owner__id, name, start_at, max_players, u.*
        FROM tournament.tournament t
        JOIN tournament.user__tournament ut on t.tournament__id = ut.tournament__id
        JOIN iam."user" u ON t.owner__id = u.user__id
        WHERE ut.user__id = $1
      `, [user__id])
      .then((res) => {
        return res.rows.map((row) => {
          const tournament = Tournament.fromObject(row)
          const user = User.fromObject(row)
          tournament.user = user
          tournament.player_count = row.player_count
          return tournament
        })
      })
  }

  /**
   * @param tournament__id string
   * @return UserVictoriesCount
   * Victories, user__id
   * 2,9c606402-5500-4177-a58e-5f2296a6b82f
   * 1,3e59b833-fd3f-4966-8c8b-d1b3d87fef5c
   * 1,4ec91c24-80a8-44ad-87c2-e8404244bf76
   */
  public static async getSortedUsersVictories(tournament__id: string): Promise<UserVictoriesCount[]> {
    return getPool().query<{ victories: number } & IUser>(
      `
          with t as (
              select 1 as query_id, count(first_player_result) as victories, first_player__id as user__id
              from tournament.round
              where tournament__id = $1 and first_player_result = true
              group by first_player__id
              UNION
              select 2 as query_id, count(second_player_result) as victories, second_player__id as user__id
              from tournament.round
              where tournament__id = $1 and second_player_result = true
              group by second_player__id
              UNION
              select 3 as query_id, 0 as victories, user__id 
              from tournament.user__tournament
              where tournament__id = $1
          )
          select sum(victories) as victories, u.* 
          from t
          join iam."user" u on u.user__id = t.user__id
          group by u.user__id
          order by victories desc
      `, [tournament__id]
    ).then((res) => {
      console.log(res.rows)
      return res.rows.map((row) => ({
        victories: +row.victories,
        user: User.fromObject(row)
      }))
    })
  }
}
