import {getPool} from "@/server/db"
import {Comment, IComment} from "@/server/entities/guide/comment"
import {EntityNotFoundException} from "@/server/errors/not_found";
import {IUser, User} from "@/server/entities/iam/user";

export class CommentRepository {
  // avoid any construction of the class, every method will be static
  private constructor() {}

  public static async getMessagesOfGuide(guide__id: string): Promise<Comment[]> {
    return getPool().query<IComment & IUser>(`
        SELECT comment__id, guide__id, content, "user".*
        FROM guide.comment
        JOIN iam."user" ON comment.user__id = "user".user__id
        WHERE guide__id = $1
      `,
      [guide__id]
    ).then(result => {
      return result.rows.map(commentAndUser =>
        Comment.fromObject(commentAndUser, User.fromObject(commentAndUser)))
    })
  }

  public static async create(guide__id: string, user__id: string, content: string): Promise<Comment> {
    return getPool().query<IComment>(
      `INSERT INTO guide.comment (guide__id, user__id, content) VALUES ($1, $2, $3) RETURNING *`,
      [guide__id, user__id, content]
    ).then(result => {
      return Comment.fromObject(result.rows[0])
    })
  }

  public static async getMessageById(comment__id: string): Promise<Comment> {
    return getPool().query<IComment>(
      `SELECT comment__id, user__id, guide__id, content FROM guide.comment WHERE comment__id = $1`,
      [comment__id]
    ).then(result => {
      if (result.rowCount === 0) {
        throw new EntityNotFoundException('Comment', { comment__id })
      }

      return Comment.fromObject(result.rows[0])
    })
  }

  public static async delete(comment__id: string): Promise<void> {
    return getPool().query(
      `DELETE FROM guide.comment WHERE comment__id = $1`,
      [comment__id]
    ).then(() => {})
  }
}
