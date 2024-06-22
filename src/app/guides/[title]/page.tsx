'use client'

import styles from "./page.module.css";
import {getGuideByTitle} from "@/lib/getGuides";
import {getLoggedInUser} from "@/lib/getUser";
import {deleteGuide} from "@/lib/deleteGuide";
import {useEffect, useState} from "react";
import Button from "@/components/button/button";
import {IGuide} from "@/server/entities/guide/guide";
import {createComment, getCommentsOfGuide} from "@/lib/comment";
import {IComment} from "@/server/entities/guide/comment";
import Input from "@/components/input/input";
import Message from "@/app/guides/[title]/message";
import {useRouter} from "next/navigation";

export default function GuideByTitle({ params }: {params: {title: string}}) {
  const router = useRouter()
  const [guide, setGuide] = useState<IGuide>(null)
  const [user, setUser] = useState(null)
  const [comments, setComments] = useState<IComment[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    getCommentsOfGuide(params.title)
      .then(comments => setComments(comments))
    getGuideByTitle(params.title)
      .then(guide => {
        if (!guide) {
          router.push('/guides')
        } else {
          setGuide(guide)
        }
      })
    getLoggedInUser()
      .then(u => setUser(u))
  }, []);

  function onDeleteComment(comment: IComment) {
    setComments(comments.filter(c => c.comment__id !== comment.comment__id))
  }

  function post_comment() {
    if (input) {
      createComment(guide.title, input)
        .then((comment) => {
          setComments([{ ...comment, user }, ...comments])
        })
    } else {
      alert('Veuillez entrer un commentaire')
    }
  }

  function handleChangeInput(value: string) {
    setInput(value)
  }

  function delete_guide() {
    deleteGuide(guide.title)
      .then(() => {
        router.push('/guides')
      })
  }

  if (!guide) {
    return <div>Guide introuvable</div>
  }

  const messages = comments.map(comment => (
    <Message comment={comment} guide={guide} user__id={user?.user__id} onDelete={onDeleteComment} />
  ))

  const input_comment = user
    ? <div className={styles.post_comment_container}>
      <Input placeholder="Poster un commentaire" onChange={handleChangeInput}></Input>
      <Button secondary cta onClick={post_comment}>Poster</Button>
    </div>
    : null

  const deleteBtn = user && guide.user__id === user.user__id
    ? <Button tertiary onClick={delete_guide}>Supprimer le guide</Button>
    : null

  return (
    <div className={styles.guide_container}>
      <h1>{ guide.title }</h1>
      <p>Guide rédigé par { guide.user?.username }</p>
      <p dangerouslySetInnerHTML={{__html: guide.content}}></p>
      {input_comment}
      {messages}
      <div className={styles.delete_section}>
        {deleteBtn}
      </div>
    </div>
  )
}
