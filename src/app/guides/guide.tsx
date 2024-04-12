import {IGuide} from "@/server/entities/guide/guide";
import {IUser} from "@/server/entities/iam/user";

type GuideWithUser = IGuide & {user: IUser}

export default function Guide({ guide }: {guide: GuideWithUser}) {
  return (
    <div>
      <h2>{ guide.title }</h2>
      <p>Guide rédigé par { guide.user.username }</p>
      <p>{ guide.content }</p>
    </div>
  )
}
