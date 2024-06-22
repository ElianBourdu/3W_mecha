'use client'

import Button from "@/components/button/button";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";

export function Logout() {
  const router = useRouter()

  function signout() {
    api('/api/auth/signout')
      .then((res) => {
        router.refresh()
      })
      .catch((err) => {
        alert(err.response.payload.message || err.response.payload.error || 'An error occurred')
      })
  }

  return (
    <Button primary onClick={signout}>deconnexion</Button>
  )
}