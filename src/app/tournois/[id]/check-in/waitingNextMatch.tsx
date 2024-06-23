import H1 from "@/components/titles/h1";
import styles from './page.module.css'

export default function WaitingNextMatch() {
  return (
    <div className={styles.waiting}>
      <H1>En attente du prochain match</H1>
    </div>
  )
}