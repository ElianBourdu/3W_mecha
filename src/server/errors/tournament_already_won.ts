export class TournamentAlreadyWon extends Error {
  constructor() {
    super('tournament already won')
  }
}
