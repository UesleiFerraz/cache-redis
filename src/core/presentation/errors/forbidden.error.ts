export class ForbiddenError extends Error {
  constructor() {
    super("username or password invalid");
    this.name = "ForbiddenError";
  }
}
