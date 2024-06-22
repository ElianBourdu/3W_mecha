import styles from "@/app/guides/[title]/page.module.css";
import {IComment} from "@/server/entities/guide/comment";
import {deleteComment} from "@/lib/comment";
import {IGuide} from "@/server/entities/guide/guide";
import Button from "@/components/button/button";

export default function Message(
  { comment, onDelete, guide, user__id }:
    { comment: IComment, onDelete: (comment: IComment) => void, guide: IGuide, user__id: string}
) {
  function delete_comment() {
    deleteComment(comment.comment__id)
      .then(() => {
        onDelete(comment)
      })
  }

  const delete_button = guide.user__id === user__id || comment.user__id === user__id
    ? <div className={styles.delete_section}>
      <Button tertiary onClick={delete_comment}>Supprimer</Button>
    </div>
    : null

  return (
    <div key={comment.comment__id} className={styles.comment_container}>
      <div className={styles.comment}>
        <p>{comment.content}</p>
        <p className={styles.comment_author}>Commentaire de {comment.user?.username}</p>
      </div>
      {delete_button}
    </div>
  )
}
