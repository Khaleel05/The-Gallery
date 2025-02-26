import React, { useRef } from 'react'
import Movies from '../API/movies'
import Style from './carousel.module.css'

//the component containing the movies and lining them up. 
const Carousel = ({genre, Gkey}) => {


  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div style={{border:'solid 1px blue'}}>
      <h2 style={{color: 'white', fontFamily: 'sans-serif', marginLeft: '1.2em'}}>{genre}</h2>
      <div style={{boarder: 'solid 1px blue'}}>
          <div  className={Style.carousel} ref={carouselRef}>
              <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', left: '2%', cursor:'pointer'}} name="arrow-back-circle-outline" onClick={scrollLeft}></ion-icon>
              <ion-icon style={{color: 'white', height:'70px', width:'70px', position: 'absolute', right: '2%', cursor:'pointer'}}  name="arrow-forward-circle-outline" onClick={scrollRight}></ion-icon>
            <Movies key = {Gkey}/>
          </div>
      </div>
    </div>
  )
}

export default Carousel
