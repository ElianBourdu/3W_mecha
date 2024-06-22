import {User} from "@/server/entities/iam/user";

export interface IComment {
  comment__id: string,
  user__id: string,
  guide__id: string,
  content: string,
  user?: User
}

export class Comment implements IComment {
  public comment__id: string
  public user__id: string
  public guide__id: string
  public content: string
  public user?: User

  public static fromObject(object: IComment, user: User = null): Comment {
    const comment = new Comment()
    comment.comment__id = object.comment__id
    comment.user__id = object.user__id
    comment.guide__id = object.guide__id
    comment.content = object.content
    comment.user = user
    return comment
  }

  public toJson(): Record<string, string | object> {
    return {
      comment__id: this.comment__id,
      user__id: this.user__id,
      guide__id: this.guide__id,
      content: this.content,
      ...(this.user ? { user: this.user.toJson() } : {})
    }
  }
}
