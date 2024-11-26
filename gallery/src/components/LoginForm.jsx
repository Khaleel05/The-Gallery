import React from 'react'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import './loginForm.css'




const loginFormStyle = {
    LoginFields:{
        marginBottom: "10px",
    },
    ButtonWrapper:{
        display: "flex",
        justifyContent: "center",
        marginTop: "4em",
        marginBottom: "10px",
    },
    button:{
        backgroundColor:'black',
        padding: '10px',
        color: 'white',
        borderRadius: '5px',
        width: '150%',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '10px',
    },
    wrapper:{
        height: "400px",
        width: "420px",
        background: "transparent",
        color: "ffffff",
        border: "2px green solid",
        boxShadow: "0 0 10px rgba(255, 255, 255, .2)",
        backdropFilter: "blur(30px)",
        borderRadius: "20px",
        padding: "30px 40px"
        
    },
    wrapperH1: {
        color: "#fff",
        fontSize: "2em",
        textAlign: "center",
    },
    wrapperInputBox: {
        position: "relative",
        width: "100%",
        height: "50px",
        margin: "30px 0"
    },
    wrapperInput: {
        height: "100%",
        width: "100%",
        background: "transparent",
        border: "none",
        outline: "none",
        border: "2px solid rgba(255, 255, 255, .2)",
        borderRadius: "40px",
        fontSize: "1em",
        color: "#fff",
        padding: "0.5em"
    },
    inputBoxIcon: {
        postion: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "1.5em",
        color: '#fff',
    },
    rememberMe: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.8em",
        margin: "-1em 0 1em",
    },
    forgotPassword: {
        color: "white",
        textDecoration: "none",
    },
    LoginButton: {
        width: "100%",
        height: "3.5em",
        backgroundColor: "white",
        border: "none",
        outline: "none",
        borderRadius: "40px",
        boxShadow: "0 0 10px rgba(0, 0, 0, .1",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },
    registerText: {
        color: "#ffg",
        fontSize: "14.5px",
        textAlign: "center",
        margin: "20px 0 15px"
    },
    registerLink: {
        color: "white",
        textDecoration: "none",
        marginLeft: "10px",
        fontWeight: "600"
    }
    
}
    

const passwordConditions = () => {
    return (
        <div>
            <ul>
                <li>Password must be at least 8 characters long.</li>
                <li>Password must contain at least one uppercase letter.</li>
                <li>Password must contain at least one lowercase letter.</li>
                <li>Password must contain at least one number.</li>
                <li>Password must contain at least one special character (!@#$%^&*).</li>
            </ul>

        </div>
    )
}

function LoginForm() {
  return (
    <div className="wrapper" style={loginFormStyle.wrapper}>
        <form action= " ">
            <h1 style={loginFormStyle.wrapperH1}>Login</h1>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <input style={loginFormStyle.wrapperInput} type = "text" placeHolder="Username" required/>
                <FaUser style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <input style={loginFormStyle.wrapperInput} type = "password" placeHolder="Password" required/>
                <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div style={loginFormStyle.rememberMe} className = "remember-forgot">
                <label><input type="checkbox"/>Remember Me</label>
                <a style={loginFormStyle.forgotPassword} href="#">Forgot Password?</a>
            </div>

            <button style={loginFormStyle.LoginButton} type="submit">Login</button>
            <div style={loginFormStyle.registerText} className="register-link">
                <p>Don't have an account?<a style={loginFormStyle.registerLink} href="#">Register</a></p>
            </div>
        </form>
    </div>
  )
}



export default LoginForm
