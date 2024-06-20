import {IGuide} from "@/server/entities/guide/guide";
import {IUser} from "@/server/entities/iam/user";
import styles from "./guide.module.css";
import Button from "@/components/button/button";

export default function Guide({ guide }: {guide: IGuide}) {
  return (
    <Button  href={`/guides/${encodeURI(guide.title)}`} cta tertiary>
      <div className={styles.guide}>
        <h2 className={styles.title}>{guide.title}</h2>
        <p className={styles.wrote_by}>Guide rédigé par {guide.user.username}</p>
        <p className={styles.content}>{guide.content}</p>
      </div>
    </Button>
  )
}
