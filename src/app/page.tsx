import styles from "./page.module.css";
import {getUser} from "@/lib/getUser";

export default async function Home() {
  const user = await getUser()

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        { user ? user.username : '' }
      </div>
    </main>
  );
}
