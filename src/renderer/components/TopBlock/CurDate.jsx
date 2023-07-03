import React from 'react';

const date = new Date()
const monthNames = 
    ["янв.", "февр.", "марта", "апр.", "мая", "июня",
     "июля", "авг.", "сент.", "окт.", "нояб.", "дек."];

function monthName() {
    return(monthNames[date.getMonth()]);
}

function dayOfTheWeek(){
    var days = [
        'вс',
        'пн',
        'вт',
        'ср',
        'чт',
        'пт',
        'сб'
      ];
      var d = new Date();
      var n = d.getDay();
      return days[n];
}

function CurDate(){

    let day = date.getDate();
    
    return (
        <>
        {dayOfTheWeek()}. {day} {monthName()}
        </>
    )
}

export default CurDate;