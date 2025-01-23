import React from 'react'
import Movies from '../API/movies'
import Style from './carousel.module.css'

const Carousel = () => {
  return (
    <div  className={Style.carousel}>
        <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', left: '2%', top: '20%'}} name="arrow-back-circle-outline"></ion-icon>
        <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', right: '2%', top: '20%'}}  name="arrow-forward-circle-outline"></ion-icon>
      <Movies/>
    </div>
  )
}

export default Carousel
