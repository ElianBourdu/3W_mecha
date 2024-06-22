import {getPool} from "@/server/db"
import {Guide, IGuide} from "@/server/entities/guide/guide"
import {EntityNotFoundException} from "@/server/errors/not_found";

export class GuideRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  public static async getAllGuides({ title }: { title?: string } = {}): Promise<Guide[]> {
    const whereClauses = []
    const params = []
    if (title) {
      whereClauses.push(`title LIKE $${params.length + 1}`)
      params.push(`%${title}%`)
    }
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    return getPool().query<IGuide>(
      `SELECT guide__id, user__id, title, content FROM guide.guide ${whereClause}`,
      params
    ).then(guideList => {
      return guideList.rows.map(guide => Guide.fromObject(guide))
    })
  }

  public static async delete(guide__id: string): Promise<void> {
    return getPool().query(
      `DELETE FROM guide.guide WHERE guide__id = $1`,
      [guide__id]
    ).then((result) => {
      if (result.rowCount === 0) {
        throw new EntityNotFoundException('Guide', { guide__id })
      }
    })
  }

  public static async getGuideById(guide__id: string, isThrowing = true): Promise<Guide> {
    return getPool().query<IGuide>(
      `SELECT guide__id, user__id, title, content FROM guide.guide WHERE guide__id = $1`,
      [guide__id])
      .then((res) => {
        if (res.rows.length === 0) {
          if (isThrowing) {
            throw new EntityNotFoundException('Guide', { guide__id })
          } else {
            return null
          }
        }

        return Guide.fromObject(res.rows[0])
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
