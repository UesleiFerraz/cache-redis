import { ScrapEntity } from "../../../../core/infra";
import { Scrap } from "../../domain";

export class ScrapRepository {
  async create(params: Scrap): Promise<Scrap> {
    const { title, description, userUid } = params;

    const scrap = await ScrapEntity.create({
      title,
      description,
      userUid,
    }).save();

    return Object.assign({} as Scrap, params, scrap);
  }

  async getAll(): Promise<Scrap[]> {
    const scraps = await ScrapEntity.find({
      relations: ["users"],
      order: {
        createdAt: "ASC",
      },
    });

    return scraps.map(scrap => ({
      ...scrap,
      user: scrap.user,
    }));
  }

  async getOne(uid: string): Promise<Scrap | null> {
    const scrap = await ScrapEntity.findOne(uid, { relations: ["users"] });

    if (!scrap) {
      return null;
    }

    return {
      ...scrap,
      user: scrap.user,
    };
  }

  async update(uid: string, params: Scrap): Promise<Scrap | null> {
    const { title, description } = params;

    const scrap = await ScrapEntity.findOne(uid, { relations: ["users"] });

    if (!scrap) {
      return null;
    }

    scrap.title = title;
    scrap.description = description;

    const scrapUpdated = await scrap.save();

    return {
      ...scrapUpdated,
    };
  }

  async delete(uid: string): Promise<null | void> {
    const scrap = await ScrapEntity.findOne(uid);

    if (!scrap) {
      return null;
    }

    await scrap.remove();
  }
}