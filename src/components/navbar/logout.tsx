'use client'

import Button from "@/components/button/button";
import {useRouter} from "next/navigation";

export function Logout() {
  const router = useRouter()

  function signout() {
    fetch('/api/auth/signout')
      .then((res) => {
        if (res.ok) {
          router.refresh()
        } else {
          alert('Erreur lors de la déconnexion')
        }
      })
  }

  return (
    <Button primary onClick={signout}>deconnexion</Button>
  )
}