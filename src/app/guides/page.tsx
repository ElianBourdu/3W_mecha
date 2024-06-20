'use client'

import {IGuide} from "@/server/entities/guide/guide";
import Guide from "@/app/guides/guide";
import {IUser} from "@/server/entities/iam/user";
import SearchBar from "@/components/searchBar";
import {getGuides} from "@/lib/getGuides";
import {useEffect, useState} from "react";
import styles from "./page.module.css";

type GuideWithUser = IGuide & { user: IUser }

export default function Guides() {
  const [guides, setGuides] = useState<GuideWithUser[]>([])
  const handleChange = (inputValue: string) => {
    getGuides({ title: inputValue }).then(guides => setGuides(guides))
  }

  useEffect(() => {
    getGuides().then(guides => setGuides(guides))
  }, [])

  return (
    <>
      <div className={styles.searchBar}>
        <SearchBar placeholder="Rechercher un guide !" onChange={handleChange} />
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
