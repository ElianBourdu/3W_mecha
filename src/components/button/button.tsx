import Link from 'next/link';
import styles from "./button.module.css";
import React from "react";

type ButtonOptions = {
  children: React.ReactNode
  type?: 'reset' | 'submit' | 'button'
  style?: React.CSSProperties,
  href?: string,
  cta?: boolean,
  primary?: boolean,
  secondary?: boolean,
  tertiary?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button(props: ButtonOptions) {
  const buttonType = props.cta ? styles.cta : styles.button;
  const styleType = props.primary ? styles.primary : props.secondary ? styles.secondary : props.tertiary ? styles.tertiary : styles.primary;
  const className = buttonType + ' ' + styleType;

  if (props.href) {
    return (
      <Link className={className} href={props.href} style={props.style}>
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick ?? (() => null)} className={className} type={props.type} style={props.style}>
      {props.children}
    </button>
  )
};
