'use client'

import React, {HTMLInputTypeAttribute} from "react";
import styles from "./input.module.css";

type InputOptions = {
  value?: string,
  onChange?: (value: string) => void,
  placeholder?: string,
  type?: HTMLInputTypeAttribute
  name?: string
}

export default function Input(props: InputOptions) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange === undefined) return
    props.onChange(e.target.value)
  }

  return (
    <>
      <input
        className={styles.input}
        type={props.type}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        name={props.name}
      />
    </>
  )
}
