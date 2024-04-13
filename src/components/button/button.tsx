import Link from 'next/link';
import styles from "./button.module.css";

type ButtonOptions = {
  content: string,
  isLink: boolean,
  /**
   * only used if isLink: false
   */
  type: 'reset' | 'submit' | 'button'
}

export default function Button({content, isLink, type}: ButtonOptions) {
  if (isLink) {
    return (
      <Link className={styles.link} href="/public">
        {content}
      </Link>
    );
  }

  return (
    <button type={type}></button>
  )
};
