import Link from 'next/link';
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/public">
        Home
      </Link>
      <Link href="/guides">
        guides
      </Link>
    </nav>
  );
};
