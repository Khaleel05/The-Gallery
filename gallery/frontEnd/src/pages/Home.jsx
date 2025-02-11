import React from 'react'
import Header from '../sections/Header'
import './home.css'
import Carousel from '../sections/Carousel'
import Banner from '../sections/Banner'
import GenreApiList from '../data/GenreApiList'

function Home() {
  return (
    <div>
      <Header/>
      
      <div id='Pbody'>
        <Banner/>
        <Carousel/>
        <Carousel/>
      </div>
    </div>
  )
}

export default Home
