import {IRound} from "@/server/entities/tournament/round";

export class InvalidRound extends Error {
  constructor(round: IRound, message: string) {
    super(`Invalid round ${round.round__id}, ${message}`);
  }
}
