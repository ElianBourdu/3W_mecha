import styles from "./page.module.css";
import {getLoggedInUser} from "@/lib/getUser";

export default async function Home() {
  const user = await getLoggedInUser()

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        { user ? user.username : '' }

      {/*
       1 - timer du prochain tournoi
       2 - CTA vers liste tournois
       3 -
       */}
      </div>
    </main>
  );
}
