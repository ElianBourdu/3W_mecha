import styles from "./navbar.module.css";
import Button from "@/components/button/button";
import {getLoggedInUser} from "@/lib/getUser";
import {Logout} from "@/components/navbar/logout";

export default async function Navbar() {
  const user = await getLoggedInUser()

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Button href='/'>home</Button>
        <Button href='/guides'>guides</Button>
        <Button href='/tournois'>tournois</Button>
        { !!user &&
          <Button href='/tournois/mes-tournois'>mes tournois</Button>
        }
      </div>
      <div className={styles.ctas}>
        { !user &&
          <>
            <Button href='/signin' cta secondary>connexion</Button>
            <Button href='/signup' cta tertiary>inscription</Button>
          </>
        }
        { !!user &&
          <Logout />
        }
      </div>
    </nav>
  );
};
