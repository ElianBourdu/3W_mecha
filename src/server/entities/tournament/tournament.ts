import {User} from "@/server/entities/iam/user";

export interface ITournament {
  tournament__id: string
  owner__id: string
  name: string
  start_at: Date
  max_players: number
}

export class Tournament implements ITournament {
  public tournament__id: string
  public owner__id: string
  public name: string
  public start_at: Date
  public max_players: number

  public user?: User

  public static fromObject(object: ITournament): Tournament {
    const tournament = new Tournament()
    tournament.tournament__id = object.tournament__id
    tournament.owner__id = object.owner__id
    tournament.name = object.name
    tournament.start_at = object.start_at
    tournament.max_players = object.max_players
    return tournament
  }

  public toJson(): Record<string, string | number | object> {
    return {
      tournament__id: this.tournament__id,
      owner__id: this.owner__id,
      name: this.name,
      start_at: this.start_at.toISOString(),
      ...(this.user ? { user: this.user.toJson() } : {})
    }
  }
}
