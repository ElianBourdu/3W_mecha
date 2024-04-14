import {IUser, User} from "@/server/entities/iam/user";

export interface IRound {
  round__id: string
  tournament__id: string
  stage: number
  start_at: Date
  first_player__id: string
  first_player_checkin: Date
  first_player_result: boolean
  second_player__id: string
  second_player_checkin: Date
  second_player_result: boolean
  first_player?: IUser
  second_player?: IUser
}

export class Round implements IRound {
  public round__id: string
  public tournament__id: string
  public stage: number
  public start_at: Date
  public first_player__id: string
  public first_player_checkin: Date
  public first_player_result: boolean
  public second_player__id: string
  public second_player_checkin: Date
  public second_player_result: boolean

  public first_player?: User
  public second_player?: User

  public static fromObject(object: IRound): Round {
    const round = new Round()
    round.round__id = object.round__id
    round.tournament__id = object.tournament__id
    round.stage = object.stage
    round.start_at = object.start_at
    round.first_player__id = object.first_player__id
    round.first_player_checkin = object.first_player_checkin
    round.first_player_result = object.first_player_result
    round.second_player__id = object.second_player__id
    round.second_player_checkin = object.second_player_checkin
    round.second_player_result = object.second_player_result
    return round
  }

  public toJson(): Record<string, string | number | boolean> {
    return {
      round__id: this.round__id,
      tournament__id: this.tournament__id,
      stage: this.stage,
      start_at: this.start_at.toISOString(),
      first_player__id: this.first_player__id,
      first_player_checkin: this.first_player_checkin.toISOString(),
      first_player_result: this.first_player_result,
      second_player__id: this.second_player__id,
      second_player_checkin: this.second_player_checkin.toISOString(),
      second_player_result: this.second_player_result,
    }
  }
}
