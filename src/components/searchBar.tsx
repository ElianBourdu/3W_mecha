'use client'

import {useState} from "react";

export default function SearchBar(props: { onChange: (value: string) => void }) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const handleChange = (e) => {
    setSearchInputValue(e.target.value)
    props.onChange(e.target.value)
  }

  return (
    <>
      <input type="text" value={searchInputValue} onChange={handleChange}/>
    </>
  )
}
