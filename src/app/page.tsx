import styles from "./page.module.css";
import {getUser} from "@/lib/getUser";

export default function Home() {
  const user = getUser()

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        { user ? user.username : '' }
      </div>
    </main>
  );
}
