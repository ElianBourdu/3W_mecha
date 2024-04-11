import {getPool} from "@/server/db"
import {Guide, IGuide} from "@/server/entities/guide/guide"
import {EntityNotFoundException} from "@/server/errors/not_found";

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

  public static async getGuideByTitle(title: string, isThrowing = true): Promise<Guide> {
    return getPool().query<IGuide>(
      `SELECT guide__id, user__id, title, content FROM guide.guide WHERE title = $1`,
      [title])
      .then((res) => {
        if (res.rows.length === 0) {
          if (isThrowing) {
            throw new EntityNotFoundException('Guide', { title })
          } else {
            return null
          }
        }

        return Guide.fromObject(res.rows[0])
      })
  }

  public static async createGuide(title: string, content: string, user__id: string): Promise<Guide> {
    return getPool().query<IGuide>(
      `INSERT INTO guide.guide (title, content, user__id) VALUES ($1, $2, $3) RETURNING *`,
      [title, content, user__id]
    ).then(result => {
      return Guide.fromObject(result.rows[0])
    })
  }
}
