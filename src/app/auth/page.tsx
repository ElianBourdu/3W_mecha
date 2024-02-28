'use client'

import styles from './page.module.css'

export default async function Auth() {
  function handleSubmit(event) {
    console.log(event)
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>

        <label htmlFor="username">
          username
          <input type="text" name="username"/>
        </label>

        <label htmlFor="steam_username">
          steam_username
          <input type="text" name="steam_username"/>
        </label>

        <label htmlFor="password">
          password
          <input type="password" name="password"/>
        </label>

        <button type="submit">
          créer mon compte
        </button>
      </form>
    </div>
  )
}