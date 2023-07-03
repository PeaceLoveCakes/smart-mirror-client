import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  let hours = time.getHours();
  if (hours < 10) hours = '0' + hours;

  let minutes = time.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;

  let seconds = time.getSeconds();
  if (seconds < 10) seconds = '0' + seconds;

  const timeString = `${hours}:${minutes}`
//   :${seconds}`;

  return (
    <>
      {timeString}
    </>
  );
}

export default Clock;