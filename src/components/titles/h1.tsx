'use client'

import styles from './h1.module.css'

export default function H1(props: Record<string, any>) {
  return (<h1 className={styles.h1} {...props}/>)
}
