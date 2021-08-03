import {
  HttpRequest,
  HttpResponse,
  MVCController,
  ok,
} from "../../../../core/presentation";
import { UserRepository } from "../../infra";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController implements MVCController {
  readonly #repository: UserRepository;

  constructor(repository: UserRepository) {
    this.#repository = repository;
  }
  index(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  show(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  update(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  delete(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }

  public async store(request: HttpRequest): Promise<HttpResponse> {
    const user = await this.#repository.getOne(request.body.username);

    if (user) {
      return {
        statusCode: 409,
        body: {
          message: "Username already taken",
        },
      };
    }

    const newUser = await this.#repository.create(request.body);

    return ok(newUser);
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const { username, password } = request.body;

    const user = await this.#repository.getOne(username);

    if (!user) {
      return {
        statusCode: 404,
        body: {
          message: "User not found",
        },
      };
    }

    const secret = process.env.SECRET || "123";
    let token: string | undefined;
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return {
          statusCode: 401,
          body: {
            message: "Invalid password",
          },
        };
      }

      token = jwt.sign({ id: user.uid }, secret, { expiresIn: "1h" });
    }

    return ok(token);
  }
}
