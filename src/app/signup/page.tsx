'use client'

import styles from './page.module.css'
import {type FormEvent} from "react";

export default async function Auth() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const inputs = event.currentTarget.elements
    createUser(inputs["username"].value, inputs["password"].value, inputs["steam_username"].value)
  }

  function createUser(username: string, password: string, steam_username: string) {
    fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({username, password, steam_username}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
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