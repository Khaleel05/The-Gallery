import React, {useEffect} from 'react'
import LoginForm from '../components/LoginForm'
import backgroundImage from "../images/gallery-background.jpeg"; // Import the image

const loginStyle = {
    myComponent: {
        backgroundColor: "white",
        color: "black",
        padding: "10px",
        borderRadius: "5px",
        width: '30em',
        height: '30em',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
    heading: {
        color: "Black",
        border: 'green solid', 
        alignItems: 'center', 
        paddingBottom: '2em',
        display: "flex",
        justifyContent: "center",
        fontFamily: "Montserrat ,sans-serif",
    },
} 



function Login() {
    //this useEffect is to rerender the login page 
    useEffect(() => {
        var bodyStyle = document.body.style;
        document.body.style.background = `black url(${backgroundImage}) no-repeat center center fixed`;
        bodyStyle.backgroundSize = 'contain';
        bodyStyle.display = 'flex';
        bodyStyle.justifyContent = 'center';
        bodyStyle.alignItems = 'center';
        bodyStyle.minHeight = '100vh';

        
        return () => {
            //document.body.style.backgroundColor = 'white';
            document.body.style.background ='black';
        };
        
    }, []);

    return(
        <div>

            <LoginForm />
            
        </div>
        
    )
}

export default Login;
