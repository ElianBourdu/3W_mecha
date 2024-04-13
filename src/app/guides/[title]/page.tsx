import {IGuide} from "@/server/entities/guide/guide";

async function getGuideByTitle(title: string): Promise<IGuide> {
  return fetch(`http://localhost:3000/api/guides/${title}`)
    .then(res => res.json())
    .then(json => json.data)
}

export default async function GuideByTitle({ params }: {params: {title: string}}) {
  const guide = await getGuideByTitle(params.title)

  return (
    <div>
      <h2>{ guide.title }</h2>
      <p>Guide rédigé par { guide.guide__id }</p>
      <p>{ guide.content }</p>
    </div>
  )
}
