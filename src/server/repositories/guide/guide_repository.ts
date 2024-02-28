import {getPool} from "@/server/db"
import {Guide, IGuide} from "@/server/entities/guide/guide"

export class GuideRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  public static async getAllGuides(): Promise<Guide[]> {
    return getPool().query<IGuide>(
      `SELECT guide__id, user__id, title, content FROM guide.guide`
    ).then(guideList => {
      return guideList.rows.map(guide => Guide.fromObject(guide))
    })
  }
}
