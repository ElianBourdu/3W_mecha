import {User} from "@/app/users/user";
import {IUser} from "@/server/entities/iam/user";

async function getUsers() {
  return fetch('http://localhost:3000/api/users')
}

export default async function Users() {
  const usersResponse = await getUsers()
  const users: { data: IUser[] } = await usersResponse.json()

  return (
    <main>
      { users.data.map(user => {
        return (
          <User user={user} />
        )
      }) }
    </main>
  );
}
