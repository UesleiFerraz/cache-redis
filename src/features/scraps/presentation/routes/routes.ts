import { Router } from "express";
import {
  EMVC,
  middlewareAdapter,
  MVCController,
  routerMvcAdapter,
} from "../../../../core/presentation";
import { CacheRepository, ScrapRepository } from "../../infra";
import { ScrapController } from "../controllers";
import { ScrapMiddleware } from "../middlewares";

const makeController = (): MVCController => {
  const repository = new ScrapRepository();
  const cache = new CacheRepository();

  return new ScrapController(repository, cache);
};

export default class ScrapRoutes {
  public init(routes: Router) {
    routes.get("/scraps", routerMvcAdapter(makeController(), EMVC.INDEX));

    routes.get("/scraps/:uid", routerMvcAdapter(makeController(), EMVC.SHOW));

    routes.post(
      "/scraps",
      middlewareAdapter(new ScrapMiddleware()),
      routerMvcAdapter(makeController(), EMVC.STORE)
    );

    routes.put(
      "/scraps/:uid",
      middlewareAdapter(new ScrapMiddleware()),
      routerMvcAdapter(makeController(), EMVC.UPDATE)
    );

    routes.delete(
      "/scraps/:uid",
      routerMvcAdapter(makeController(), EMVC.DELETE)
    );
  }
}
