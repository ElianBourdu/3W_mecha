'use client'

import {useState} from "react";
import styles from "./searchBar.module.css";


export default function SearchBar(props: { onChange: (value: string) => void, placeholder: string}) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const handleChange = (e) => {
    setSearchInputValue(e.target.value)
    props.onChange(e.target.value)
  }

  return (
    <>
      <input className={styles.searchBar} type="text" value={searchInputValue} onChange={handleChange} placeholder={props.placeholder}/>
    </>
  )
}
