export class StageNotFinished extends Error {
  constructor(stage: number, message: string) {
    super(`Stage ${stage} not finished, ${message}`);
  }
}
