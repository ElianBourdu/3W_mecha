export class EntityNotFoundException extends Error {
  constructor(entity: string, criteria: any) {
    super(`Entity ${entity} not found, criteria: ${JSON.stringify(criteria)}`);
  }
}
