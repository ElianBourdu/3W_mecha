'use client'

import Wysiywg from "@/components/wysiywg";
import {useState} from "react";
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

async function createGuide(title: string, content: string) {
  return fetch('/api/guides', {
    body: JSON.stringify({ title, content }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

const GUIDE_CREATED = 'Le guide à bien été créer !'
const GUIDE_FAILED = 'Le guide n\'a pas pu être créer !'

export default function CreateGuide() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  function create() {
    createGuide(title, content)
      .then((response) => {
        if (response.status === 201) {
          setMessage(GUIDE_CREATED)
          setTimeout(() => {
            router.push('/guides')
          }, 2000)
        } else {
          setMessage(GUIDE_FAILED)
        }
      })
  }

  return (
    <>
      <form className={styles.container}>
        <input
          className={styles.title_input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={"Titre du guide"}
        />
        <Wysiywg
          placeholder="Rédigez votre guide ici..."
          onChange={(value) => setContent(value)}
        />
        <div className={styles.submit_container}>
          { message.length > 0 &&
            <i>
              {message}
            </i>
          }
          <button className={styles.submit_button} onClick={create}>
            Créer le guide
          </button>
        </div>
      </form>
    </>
  )
}
