import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>{new Date().getFullYear()}</p>
      <p>MechaWiki - Tout droit réservés</p>
    </footer>
  )
}