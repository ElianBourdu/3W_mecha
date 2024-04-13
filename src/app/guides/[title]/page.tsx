import styles from "./page.module.css";
import {getGuideByTitle} from "@/lib/getGuides";

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
