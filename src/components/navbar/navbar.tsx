import styles from "./navbar.module.css";
import Button from "@/components/button/button";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Button isLink={true} href='/'>home</Button>
      <Button isLink={true} href='/guides'>guides</Button>
      <Button isLink={true} href='/tournois'>tournois</Button>
    </nav>
  );
};
