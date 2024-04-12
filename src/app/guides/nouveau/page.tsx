'use client'

import Wysiywg from "@/components/wysiywg";
import {useState} from "react";
import { useRouter } from 'next/navigation'

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
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Wysiywg
        placeholder="Rédigez votre guide ici..."
        onChange={(value) => setContent(value)}
      />
      <button onClick={create}>
        Créer le guide
      </button>
      { message.length > 0 &&
        <i>
          {message}
        </i>
      }
    </>
  )
}
