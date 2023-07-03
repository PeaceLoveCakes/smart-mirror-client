import React from 'react'
import Clock from './Clock'
import CurDate from './CurDate'

export default function TopBlock() {
  return (
    <div className='TopBlock'>
      <div className='Clock'>
        <Clock/>
      </div>
      <div className='CurDate'>
        <CurDate/>
      </div>
    </div>
  )
}
