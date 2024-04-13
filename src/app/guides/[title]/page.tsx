import {IGuide} from "@/server/entities/guide/guide";
import styles from "./page.module.css";
import {IUser} from "@/server/entities/iam/user";

async function getGuideByTitle(title: string): Promise<IGuide & { user: IUser }> {
  return fetch(`http://localhost:3000/api/guides/${title}?includes=user`)
    .then(res => res.json())
    .then(json => json.data)
}

export default async function GuideByTitle({ params }: {params: {title: string}}) {
  const guide = await getGuideByTitle(params.title)

  return (
    <div className={styles.guide_container}>
      <h1>{ guide.title }</h1>
      <p>Guide rédigé par { guide.user.username }</p>
      <p dangerouslySetInnerHTML={{__html: guide.content}}></p>
    </div>
  )
}
