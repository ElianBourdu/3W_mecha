'use client'

import styles from "./page.module.css";
import {getGuideByTitle} from "@/lib/getGuides";
import {getLoggedInUser} from "@/lib/getUser";
import {deleteGuide} from "@/lib/deleteGuide";
import {useEffect, useState} from "react";
import Button from "@/components/button/button";
import {IGuide} from "@/server/entities/guide/guide";

export default function GuideByTitle({ params }: {params: {title: string}}) {
  const [guide, setGuide] = useState<IGuide>(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    getGuideByTitle(params.title)
      .then(guide => {
        if (!guide) {
          location.href = '/guides'
        } else {
          setGuide(guide)
        }
      })
    getLoggedInUser()
      .then(u => setUser(u))
  }, []);

  // const guide = await getGuideByTitle(params.title)
  // const user = await getLoggedInUser()

  function delete_guide() {
    deleteGuide(guide.title)
      .then(() => {
        window.location.href = '/guides'
      })
  }

  const deleteBtn = user && guide.user__id === user.user__id
    ? <Button tertiary onClick={delete_guide}>Supprimer</Button>
    : null

  if (!guide) {
    return <div>Guide introuvable</div>
  }

  return (
    <div className={styles.guide_container}>
      <h1>{ guide.title }</h1>
      <p>Guide rédigé par { guide.user?.username }</p>
      <p dangerouslySetInnerHTML={{__html: guide.content}}></p>
      <div className={styles.delete_section}>
        {deleteBtn}
      </div>
    </div>
  )
}
