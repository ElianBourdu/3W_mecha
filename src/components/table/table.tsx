import styles from "./table.module.css";
import React from "react";

type TableOptions = {
  children: React.ReactNode,
  cols: number
}

export default function Table({children, cols}: TableOptions) {
  return (
    <div style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} className={styles.table}>
      {children}
    </div>
  )
}

function TableHead({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className={styles.head + ' ' + className}>
      {children}
    </div>
  )
}

function TableRow({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className={styles.row + ' ' + className}>
      {children}
    </div>
  )
}

Table.Head = TableHead;
Table.Row = TableRow;
