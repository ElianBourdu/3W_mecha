'use client'

import styles from './page.module.css'
import {type FormEvent} from "react";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import H1 from "@/components/titles/h1";
import {useRouter} from "next/navigation";
import {signup} from "@/lib/auth";
import {HttpError} from "@/lib/api";

export default function Auth() {
  const router = useRouter()
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const inputs = event.currentTarget.elements
    createUser(inputs["username"].value, inputs["password"].value, inputs["steam_username"].value)
  }

  function createUser(username: string, password: string, steam_username: string) {
    signup(username, password, steam_username)
      .then(() => {
        router.push('/signin')
      })
      .catch((error: HttpError) => {
        alert(error.response.payload.error)
      })
  }

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <H1>Inscription</H1>
        <Input type="text" name="username" placeholder="nom d'utilisateur" />
        <Input type="text" name="steam_username" placeholder="pseudo Steam" />
        <Input type="password" name="password" placeholder="password" />
        <Button cta primary type="submit">
          créer mon compte
        </Button>
      </form>
    </div>
  )
}