'use client'

import styles from './h2.module.css'

export default function H2(props: Record<string, any>) {
  return (<h2 className={styles.h2} {...props}/>)
}
