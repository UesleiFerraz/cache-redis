import {
  forbidden,
  HttpMiddleware,
  HttpResponse,
  ok,
  unauthorized,
} from "../../../../core/presentation";
import jwt from "jsonwebtoken";

interface IPayLoad {
  id: string;
  iat: number;
  exp: number;
}

export class UserAuthMiddleware {
  public handle(request: HttpMiddleware): HttpResponse {
    const token = request.headers["authorization"]
      ?.replace("Bearer", "")
      .trim();
    if (!token) {
      return unauthorized();
    }

    const secret = process.env.JWT_SECRET || "123";

    try {
      const data = jwt.verify(token, secret);
      const { id } = data as IPayLoad;

      request.userUid = id;
      return ok({});
    } catch {
      return forbidden();
    }
  }
}
