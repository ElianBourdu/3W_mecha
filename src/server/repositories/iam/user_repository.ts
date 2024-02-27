import { getPool } from "@/server/db";
import { IUser, User } from "@/server/entities/iam/user";
import { EntityNotFoundException } from "@/server/errors/not_found";

export class UserRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

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
}
