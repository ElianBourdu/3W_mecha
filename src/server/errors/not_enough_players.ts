export class NotEnoughPlayers extends Error {
  constructor() {
    super('Not enough player for this tournament');
  }
}