export class UnauthorizedError extends Error {
  constructor() {
    super("you do not have permission to do it");
    this.name = "UnauthorizedError";
  }
}
