export interface IUser {
  steam_username: string
  user__id: string
  username: string
  rating: number
  password?: string
}

export class User implements IUser {
  public steam_username: string
  public user__id: string
  public username: string
  public rating: number
  public password?: string

  public static fromObject(object: IUser): User {
    const user = new User()
    user.user__id = object.user__id
    user.username = object.username
    user.steam_username = object.steam_username
    user.rating = object.rating
    user.password = object.password
    return user
  }

  public toJson(): Record<string | number, string | number> {
    return {
      steam_username: this.steam_username,
      user__id: this.user__id,
      username: this.username,
      rating: this.rating
    }
  }
}
