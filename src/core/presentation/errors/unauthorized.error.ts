export class UnauthorizedError extends Error {
  constructor() {
    super("you do not have permission");
    this.name = "UnauthorizedError";
  }
}
