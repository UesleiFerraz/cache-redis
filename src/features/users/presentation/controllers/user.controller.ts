import {
  conflict,
  forbidden,
  HttpRequest,
  HttpResponse,
  MVCController,
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation";
import { UserRepository } from "../../infra";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController implements MVCController {
  readonly #repository: UserRepository;

  constructor(repository: UserRepository) {
    this.#repository = repository;
  }

  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.#repository.getOne(request.body.username);

      if (user) {
        return conflict("Username");
      }

      const newUser = await this.#repository.create(request.body);

      return ok(newUser);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { username, password } = request.body;

      const user = await this.#repository.getOne(username);

      if (!user) {
        return notFound();
      }

      const secret = process.env.SECRET || "123";
      let token: string | undefined;
      if (user.password) {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return forbidden();
        }

        token = jwt.sign({ uid: user.uid }, secret, { expiresIn: "1h" });
      }

      return ok(token);
    } catch (error) {
      console.log(error);
      return forbidden();
    }
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
}
