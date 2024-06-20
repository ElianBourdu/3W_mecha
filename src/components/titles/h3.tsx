'use client'

import styles from './h3.module.css'

export default function H3(props: Record<string, any>) {
  return (<h1 className={styles.h3} {...props}/>)
}
