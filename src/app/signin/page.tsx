'use client'

import styles from './page.module.css'
import {type FormEvent} from "react";

export default async function Signin() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const inputs = event.currentTarget.elements
    login(inputs["username"].value, inputs["password"].value)
  }

  function login(username: string, password: string) {
    fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({username, password}),
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

        <label htmlFor="password">
          password
          <input type="password" name="password"/>
        </label>

        <button type="submit">
          Connexion
        </button>
      </form>
    </div>
  )
}