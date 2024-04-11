import {IUser} from "@/server/entities/iam/user";

export function User({ user }: { user: IUser }) {
  return (
    <div>
      { user.username }
    </div>
  )
}
