import React from 'react'
import Header from '../sections/Header'
import './home.css'
import Carousel from '../sections/Carousel'
import Banner from '../sections/Banner'

function Home() {
  return (
    <div>
      <Header/>
      <Banner/>
      <Carousel/>
      <Carousel/>
    </div>
  )
}

export default Home
