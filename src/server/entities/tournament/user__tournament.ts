export interface IUser_Tournament {
  user__id: string
  tournament__id: string
}

export class User_Tournament implements IUser_Tournament {
  public user__id: string
  public tournament__id: string

  public static fromObject(object: IUser_Tournament): User_Tournament {
    const user_tournament = new User_Tournament()
    user_tournament.user__id = object.user__id
    user_tournament.tournament__id = object.tournament__id
    return user_tournament
  }

  public toJson(): Record<string, string | number> {
    return {
      user__id: this.user__id,
      tournament__id: this.tournament__id
    }
  }
}
