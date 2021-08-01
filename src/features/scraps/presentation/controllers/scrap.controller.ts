import {
  HttpRequest,
  HttpResponse,
  MVCController,
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation";
import { ScrapRepository, CacheRepository } from "../../infra";

const ONE_MINUTE = 60;

export class ScrapController implements MVCController {
  readonly #repository: ScrapRepository;
  readonly #cache: CacheRepository;

  constructor(repository: ScrapRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest): Promise<HttpResponse> {
    try {
      const cache = await this.#cache.get("scrap:all");

      if (cache) {
        return ok(cache);
      }

      const scraps = await this.#repository.getAll();

      await this.#cache.setex("scrap:all", scraps, ONE_MINUTE);

      return ok(scraps);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const scrap = await this.#repository.create(request.body);

      return ok(scrap);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;

      const cache = await this.#cache.get(`scrap:${uid}`);

      if (cache) {
        return ok(cache);
      }

      const scrap = await this.#repository.getOne(uid);

      await this.#cache.setex(`scrap:${uid}`, scrap, ONE_MINUTE);
      return ok(scrap);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async update(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;

      const scrap = await this.#repository.update(uid, request.body);

      if (!scrap) {
        return notFound();
      }

      (await this.#cache.get(`scrap:${uid}`))
        ? this.#cache.setex(`scrap:${uid}`, scrap, ONE_MINUTE)
        : null;

      return ok(scrap);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async delete(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;

      const scrap = await this.#repository.delete(uid);

      if (!scrap) {
        return notFound();
      }

      this.#cache.del(`scrap:${uid}`);

      return ok({});
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
