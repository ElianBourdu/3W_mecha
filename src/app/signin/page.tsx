'use client'

import styles from './page.module.css'
import {type FormEvent} from "react";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import H1 from "@/components/titles/h1";

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
      .then((res) => {
        if (res.ok) {
          // on utilise pas le router, pour pouvoir rafraichir la page, et donc le composant Navbar
          window.location.href = '/'
        } else {
          alert('Mauvais identifiants')
        }
      })
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <H1>Connexion</H1>
        <Input type="text" name="username" placeholder="username"/>
        <Input type="password" name="password" placeholder="password"/>
        <Button type="submit" cta primary>
          Connexion
        </Button>
      </form>
    </div>
  )
}