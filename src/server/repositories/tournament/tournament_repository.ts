import { getPool } from "@/server/db";
import { EntityNotFoundException } from "@/server/errors/not_found";
import {ITournament, Tournament} from "@/server/entities/tournament/tournament";
import {IUser} from "@/server/entities/iam/user";
import {User} from "@/server/entities/iam/user";

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
        SELECT tournament__id, owner__id, name, start_at, user__id, username, steam_username, rating, password
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

  /**
   * retourne tous les tournois
   */
  public static async getAllTournaments(limit = 10, offset = 0, includeClosed = false): Promise<Tournament[]> {
    return getPool().query<ITournament & IUser>(
      `
        SELECT tournament__id, owner__id, name, start_at, user__id, username, steam_username, rating, password
        FROM tournament.tournament
            JOIN iam."user" u ON tournament.owner__id = u.user__id
        ${!includeClosed ? 'WHERE start_at > NOW()' : ''}
        ORDER BY start_at DESC
        LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    ).then((res) => {
      return res.rows.map((row) => {
        const tournament = Tournament.fromObject(row)
        const user = User.fromObject(row)
        tournament.user = user
        return tournament
      })
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
}
