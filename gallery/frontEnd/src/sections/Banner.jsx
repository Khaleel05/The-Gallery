import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Style from './banner.module.css'
import Backdrop from '../API/Backdrop'

function Banner() {



  return (
    <div className={Style.banner}>
      <Backdrop/>
    </div>
  )
}

export default Banner
