import React from 'react'
import Movies from '../API/movies'
import Style from './carousel.module.css'

//the component containing the movies and lining them up. 
const Carousel = () => {
  return (
    <div style={{border:'solid 1px blue'}}>
      <h2 style={{color: 'white', fontFamily: 'sans-serif', marginLeft: '1.2em'}}>New releases</h2>
      <div style={{boarder: 'solid 1px blue'}}>
          <div  className={Style.carousel}>
              <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', left: '2%'}} name="arrow-back-circle-outline"></ion-icon>
              <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', right: '2%'}}  name="arrow-forward-circle-outline"></ion-icon>
          <Movies/>
          </div>
      </div>
    </div>
  )
}

export default Carousel
