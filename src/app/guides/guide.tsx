import {IGuide} from "@/server/entities/guide/guide";
import {IUser} from "@/server/entities/iam/user";
import styles from "./guide.module.css";

type GuideWithUser = IGuide & {user: IUser}

export default function Guide({ guide }: {guide: GuideWithUser}) {
  return (
    <a href={`/guides/${encodeURI(guide.title)}`} className={styles.guide}>
      <h2 className={styles.title}>{ guide.title }</h2>
      <p className={styles.wrote_by}>Guide rédigé par { guide.user.username }</p>
      <p className={styles.content}>{ guide.content }</p>
      <a className={styles.link} href="#"></a>
    </a>
  )
}
