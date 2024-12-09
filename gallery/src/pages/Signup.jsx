import React, { useEffect } from 'react'
import SignUpForm from '../components/SignUpForm'
import backgroundImage from "../images/gallery-background.jpeg";


function Signup() {
  useEffect(() => {
    var bodyStyle = document.body.style;
    bodyStyle.background = `black url(${backgroundImage}) no-repeat center center fixed`;
    bodyStyle.backgroundSize = "contain";
    bodyStyle.display = 'flex';
    bodyStyle.justifyContent = 'center';
    bodyStyle.alignItems = 'center';
    bodyStyle.minHeight = '100vh';

    return () => {
        document.body.style.backgroundColor = 'white';
    };
}, []);

  return (
    <div>
      <SignUpForm/>
    </div>
  )
}

export default Signup
