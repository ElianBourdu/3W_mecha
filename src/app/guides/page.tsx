'use client'

import {IGuide} from "@/server/entities/guide/guide";
import Guide from "@/app/guides/guide";
import {IUser} from "@/server/entities/iam/user";
import {getGuides} from "@/lib/getGuides";
import {useEffect, useState} from "react";
import styles from "./page.module.css";
import Button from "@/components/button/button";
import {getUser} from "@/lib/getUser";
import Input from "@/components/input/input";

export default function Guides() {
  const [guides, setGuides] = useState<IGuide[]>([])
  const [user, setUser] = useState<IUser>(null)
  const handleChange = (inputValue: string) => {
    getGuides({ title: inputValue }).then(guides => setGuides(guides))
  }

  useEffect(() => {
    getUser().then(user => setUser(user))
    getGuides().then(guides => setGuides(guides))
  }, [])

  return (
    <>
      <div className={styles.searchBar}>
        <Input placeholder="Rechercher un guide !" onChange={handleChange} />
        { !!user &&
          <Button cta href="/guides/nouveau">Créer un guide</Button>
        }
      </div>
      <div className={styles.guides}>
        { guides.map(guide => {
          return (
            <Guide guide={guide} key={guide.guide__id}/>
          )
        })}
      </div>
    </>
  )
}
