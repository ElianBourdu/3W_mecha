import { getPool } from "@/server/db";
import { IUser, User } from "@/server/entities/iam/user";
import { EntityNotFoundException } from "@/server/errors/not_found";

export class UserRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  public static async createUser(user: Pick<IUser, 'username' | 'steam_username'> & { password: string }): Promise<boolean> {
    return getPool().query(
      `INSERT INTO iam."user" (username, password, steam_username) VALUES ($1, $2, $3)`,
      [user.username, user.password, user.steam_username]
    ).then(result => {
      return result.rowCount === 1
    })
  }

  public static async getUserByUsername(username: string, includePassword = false, isThrowing = true): Promise<User> {
    return getPool().query<IUser>(
      `SELECT user__id, username, steam_username, rating, password FROM iam.user WHERE username = $1`,
      [username])
      .then((res) => {
        if (res.rows.length === 0) {
          if (isThrowing) {
            throw new EntityNotFoundException('User', { username })
          } else {
            return null
          }
        }

        if (!includePassword) {
          delete res.rows[0].password
        }

        return User.fromObject(res.rows[0])
      })
  }

  /**
   * retrieve a specific user by its ID
   * @param userId string the ID of the user
   * @throws EntityNotFoundException
   */

  public static async getUserById(userId: string): Promise<User> {
    return getPool().query<IUser>(
      `SELECT user__id, username, steam_username, rating FROM iam.user WHERE user__id = $1`,
      [userId])
      .then((res) => {
        if (res.rows.length === 0) {
          throw new EntityNotFoundException('User', {id: userId})
        }

        return User.fromObject(res.rows[0])
      })
  }

  public static async getAllUsers(): Promise<User[]> {
    return getPool().query<IUser>(
      `SELECT user__id, username, steam_username, rating FROM iam.user`
    ).then(userList => {
      return userList.rows.map(user => User.fromObject(user))
    })
  }
}
