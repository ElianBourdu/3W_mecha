import Link from 'next/link';
import styles from "./button.module.css";
import React from "react";

type ButtonOptions = {
  href?: string,
  isLink: boolean,
  /**
   * only used if isLink: false
   */
  type?: 'reset' | 'submit' | 'button',
  children: React.ReactNode
}

export default function Button({href, isLink, type, children}: ButtonOptions) {
  if (isLink) {
    return (
      <Link className={styles.link} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles.button} type={type}>
      {children}
    </button>
  )
};
