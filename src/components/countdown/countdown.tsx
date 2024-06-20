'use client'

import styles from './countdown.module.css'
import {useEffect, useState} from "react";

function calculatedCountdown(countDownDate: number) {
  // Get today's date and time
  const now = new Date().getTime();
  // Find the distance between now and the countdown date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // If the countdown is finished, throw an error
  if (distance < 0) {
    throw new Error("countdown passed")
  }

  return days + "d " + hours + " h " + minutes + "m " + seconds + "s ";
}

export default function Countdown({closingDate}: {closingDate: Date}) {
  // Set the date we're counting down to
  const closingTimestamp = closingDate.getTime();
  let _isTimeElapsed = false
  let initialCountdown = ""
  try {
    initialCountdown = calculatedCountdown(closingTimestamp)
  } catch(e) {
    _isTimeElapsed = true
  }

  const [countdown, setCountdown] = useState(initialCountdown)
  const [isTimeElapsed, setIsTimeElapsed] = useState(_isTimeElapsed)

  useEffect(() => {
    if (isTimeElapsed) return

    // Update the count down every 1 second
    let x = setInterval(() => {
      try {
        setCountdown(calculatedCountdown(closingTimestamp))
      } catch(e) {
        setIsTimeElapsed(true)
        clearInterval(x)
        document.location.reload()
      }
    }, 1000);
  }, []);

  return (
    <div className={styles.countdown}>
      {!isTimeElapsed ? countdown : 'It is tiiiiiiiiiime'}
    </div>
  )
}